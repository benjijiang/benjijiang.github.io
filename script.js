// ----- Base 16:9 canvas resolution -----
const BASE_W = 1600;
const BASE_H = 900;

// ----- Sprite sheet config -----
// Sprite.png is 5 cols x 3 rows, each cell is 1254x1254.
// Row 0: walk (5 frames), Row 1: idle (3 frames), Row 2: interact/look_up (4 frames).
const SPRITE_CELL = 1254;
const ANIM = {
  walk:     { row: 0, frames: 5, speed: 6  },
  idle:     { row: 1, frames: 3, speed: 22 },
  interact: { row: 2, frames: 4, speed: 9  }
};

// ----- Assets -----
let spriteSheet;
let bgImage;
let fgImage;

// ----- World / player / input -----
let player;
let cameraX = 0;
let world;
let keys = {};

let interactionRange = 140;
let activeObject = null;
let isDialogOpen = false;

// ----- Animation state -----
let animState  = "idle";
let animFrame  = 0;
let animTick   = 0;
let facing     = "right";
let isInteracting = false;

function preload() {
  spriteSheet = loadImage("VisualAssests/Animation/Sprite.png");
  bgImage     = loadImage("VisualAssests/background.png");
  fgImage     = loadImage("VisualAssests/foreground.png");
}

function setup() {
  const c = createCanvas(BASE_W, BASE_H);
  c.parent("stage");
  textFont("Gloria Hallelujah");
  frameRate(60);
  imageMode(CORNER);

  fitCanvasToWindow();

  world = {
    width: 6400,
    groundY: 760,
    objects: [
      { x: 700,  y: 600, w: 60,  h: 80,  title: "01_01", text: "A quiet beginning. A space balloon." },
      { x: 1900, y: 560, w: 90,  h: 120, title: "03_03", text: "An attempt to make something alive." },
      { x: 3200, y: 580, w: 120, h: 100, title: "02_02", text: "I forgot what this was..." },
      { x: 4700, y: 540, w: 80,  h: 160, title: "02_03", text: "A piece about time." }
    ]
  };

  // Character on-canvas display size. The sprite cell is 1254 but the figure
  // only fills ~55% of it, so we use a generous draw box for a moderate look.
  player = {
    x: 200,
    drawW: 360,
    drawH: 360,
    speed: 5
  };
  // Feet sit at ~95% down the cell, so align that to groundY.
  player.y = world.groundY - player.drawH * 0.95;
}

function windowResized() {
  fitCanvasToWindow();
}

// Keep internal resolution at 1600x900 and letterbox via CSS so the canvas
// always fills a 16:9 region of the viewport.
function fitCanvasToWindow() {
  const target = BASE_W / BASE_H;
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  let cssW, cssH;
  if (ww / wh > target) {
    cssH = wh;
    cssW = wh * target;
  } else {
    cssW = ww;
    cssH = ww / target;
  }
  const cv = document.querySelector("canvas");
  if (cv) {
    cv.style.width  = cssW + "px";
    cv.style.height = cssH + "px";
  }
}

// ---------------- main loop ----------------
function draw() {
  if (!isDialogOpen) {
    updatePlayer();
    updateCamera();
    updateInteraction();
  }
  updateAnimation();

  renderScene();

  if (isDialogOpen && activeObject) {
    drawDialog(activeObject);
  } else if (activeObject) {
    drawInteractionHint(activeObject);
  }
}

// ---------------- update ----------------
function updatePlayer() {
  let moving = false;

  if (keys["a"] || keys["ArrowLeft"]) {
    player.x -= player.speed;
    facing = "left";
    moving = true;
  }
  if (keys["d"] || keys["ArrowRight"]) {
    player.x += player.speed;
    facing = "right";
    moving = true;
  }
  player.x = constrain(player.x, 0, world.width - player.drawW);

  if (!isInteracting) {
    const next = moving ? "walk" : "idle";
    if (next !== animState) {
      animState = next;
      animFrame = 0;
      animTick  = 0;
    }
  }
}

function updateAnimation() {
  const cfg = ANIM[animState];
  animTick++;
  if (animTick >= cfg.speed) {
    animTick = 0;
    animFrame++;

    if (animFrame >= cfg.frames) {
      if (animState === "interact") {
        // Hold the final look-up pose while dialog stays open.
        animFrame = cfg.frames - 1;
        isInteracting = false;
      } else {
        animFrame = 0;
      }
    }
  }
}

function updateCamera() {
  cameraX = player.x - width / 2 + player.drawW / 2;
  cameraX = constrain(cameraX, 0, world.width - width);
}

function updateInteraction() {
  activeObject = null;
  for (let obj of world.objects) {
    const objCenter    = obj.x + obj.w / 2;
    const playerCenter = player.x + player.drawW / 2;
    if (abs(playerCenter - objCenter) <= interactionRange) {
      activeObject = obj;
      break;
    }
  }
}

// ---------------- render ----------------
function renderScene() {
  background(248, 246, 240);

  drawBackground();   // parallax sky (back)

  push();
  translate(-cameraX, 0);
  drawObjects();
  drawPlayer();
  pop();

  drawForeground();   // looping floor line (front, top z)

  if (isDialogOpen) drawDarkOverlay();
}

// Background: scrolls 7x slower than the camera and tiles horizontally.
function drawBackground() {
  if (!bgImage) return;
  const parallax = 7;
  const scroll   = cameraX / parallax;

  const ratio = bgImage.width / bgImage.height;
  const bgH = height;
  const bgW = bgH * ratio;

  let startX = -((scroll) % bgW);
  if (startX > 0) startX -= bgW;
  for (let x = startX; x < width; x += bgW) {
    image(bgImage, x, 0, bgW, bgH);
  }
}

// Foreground: ground-line strip, head-to-tail looped at the same speed as the
// character, sits at top z so it always covers the character's feet seam.
function drawForeground() {
  if (!fgImage) return;
  const fgRatio = fgImage.width / fgImage.height;
  const fgH = 260;
  const fgW = fgH * fgRatio;
  // The horizon line inside the source image is roughly 88% down the asset.
  const fgY = world.groundY - fgH * 0.88;

  let startX = -((cameraX) % fgW);
  if (startX > 0) startX -= fgW;
  for (let x = startX; x < width; x += fgW) {
    image(fgImage, x, fgY, fgW, fgH);
  }
}

function drawObjects() {
  noFill();
  for (let obj of world.objects) {
    const isNear = activeObject === obj && !isDialogOpen;
    stroke(isNear ? 40 : 130);
    strokeWeight(isNear ? 2 : 1.2);
    rect(obj.x, obj.y, obj.w, obj.h);
  }
}

function drawPlayer() {
  if (!spriteSheet) return;

  const cfg = ANIM[animState];
  const sx = animFrame * SPRITE_CELL;
  const sy = cfg.row   * SPRITE_CELL;

  push();
  if (facing === "left") {
    // Flip horizontally around the player's draw box.
    translate(player.x + player.drawW, player.y);
    scale(-1, 1);
    image(spriteSheet, 0, 0, player.drawW, player.drawH,
                       sx, sy, SPRITE_CELL, SPRITE_CELL);
  } else {
    image(spriteSheet, player.x, player.y, player.drawW, player.drawH,
                       sx, sy, SPRITE_CELL, SPRITE_CELL);
  }
  pop();
}

function drawInteractionHint(obj) {
  fill(40);
  noStroke();
  textAlign(CENTER);
  textSize(22);
  text("W or ⬆ to interact", width / 2, height - 50);
}

function drawDarkOverlay() {
  fill(0, 170);
  noStroke();
  rect(0, 0, width, height);
}

function drawDialog(obj) {
  const cx   = width / 2;
  const topY = 140;

  textAlign(CENTER, TOP);
  noStroke();
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 2;

  drawingContext.shadowColor = "rgba(0, 0, 0, 0.9)";
  drawingContext.shadowBlur = 22;
  fill(255);
  textSize(40);
  text(obj.title, cx, topY);

  drawingContext.shadowBlur = 16;
  fill(235);
  textSize(26);
  textLeading(40);
  text(obj.text, cx, topY + 70);

  drawingContext.shadowBlur = 8;
  fill(180);
  textSize(18);
  text("ESC to return", cx, topY + 200);

  drawingContext.shadowColor = "transparent";
  drawingContext.shadowBlur = 0;
  drawingContext.shadowOffsetY = 0;
}

// ---------------- interaction ----------------
function tryInteract() {
  isInteracting = true;
  animState = "interact";
  animFrame = 0;
  animTick  = 0;

  if (activeObject && !isDialogOpen) {
    isDialogOpen = true;
  }
}

function closeDialog() {
  isDialogOpen = false;
  isInteracting = false;
  animState = "idle";
  animFrame = 0;
  animTick  = 0;
}

// ---------------- keys ----------------
function keyPressed() {
  keys[key] = true;
  keys[keyCodeToName(keyCode)] = true;

  if (!isDialogOpen && (key === "w" || key === "W" || keyCode === UP_ARROW)) {
    tryInteract();
  }
  if (isDialogOpen && keyCode === ESCAPE) {
    closeDialog();
  }
  return false;
}

function keyReleased() {
  keys[key] = false;
  keys[keyCodeToName(keyCode)] = false;
}

function keyCodeToName(code) {
  if (code === LEFT_ARROW)  return "ArrowLeft";
  if (code === RIGHT_ARROW) return "ArrowRight";
  if (code === UP_ARROW)    return "ArrowUp";
  return "";
}
