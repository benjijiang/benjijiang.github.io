// ----- Loading screen animation (runs independently of p5.js) -----
const LOADER_TOTAL = 23;
let loaderCount = 0;
let loaderReady = false;

function loaderTrack() { loaderCount++; }

(function () {
  const loaderEl = document.getElementById("loader");
  const canvas   = document.getElementById("loader-canvas");
  if (!loaderEl || !canvas) return;

  const ctx = canvas.getContext("2d");
  const DPR = window.devicePixelRatio || 1;

  const DOT_MIN_R  = 3;
  const DOT_MAX_R  = 70;
  const RAMP_ACCEL = 0.07;

  let phase        = "grow";
  let smoothR      = DOT_MIN_R;
  let dotX, dotY, dotR;
  let vel          = 0;
  let rot          = 0;
  let rollSubPhase = "curve";
  let curveAlpha   = Math.PI;
  let curveCx      = 0;
  let curveCy      = 0;
  let curveR       = 0;

  const svgImg = new Image();
  svgImg.src = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.6 -3.2 35.2 43.2">' +
    '<path fill="#fff" d="m26.83,19.64s0,0,0,0c0,0,0-.01,0-.02,0,0,0,.02-.01.03Zm2.15-4.59c-.05-.32-.09-.63-.16-.94-.04-.18-.11-.36-.19-.54-.09-.46-.23-.92-.39-1.37-.19-.67-.4-1.33-.7-1.96-.37-.85-.89-1.63-1.42-2.39-.81-1.12-1.74-2.21-2.89-3.01-.06-.04-.14-.08-.21-.13-.56-.29-1.1-.64-1.68-.89-.43-.18-.87-.32-1.31-.48-.45-.16-.91-.26-1.39-.3-.58-.08-1.15-.15-1.74-.08-.25,0-.5.03-.74.05-.18-.01-.36-.02-.53-.03-.09-.02-.17-.04-.26-.04-.44-.06-.88.01-1.31.09-.82.14-1.47.73-2.18,1.12-.67.36-1.29.78-1.9,1.23-.39.26-.78.52-1.12.84-.36.35-.75.67-1.13,1-.36.33-.69.68-1.04,1.02-.54.54-.96,1.18-1.44,1.77-.92,1.21-1.53,2.64-1.99,4.08-.25.72-.29,1.49-.33,2.25-.01.55.04,1.09.12,1.63.05.57.14,1.14.22,1.7-.02.69.04,1.39.22,2.06.22.72.47,1.43.75,2.14.07.14.16.26.24.39.36.96.85,1.89,1.63,2.58.52.45,1.11.82,1.73,1.13.38.19.76.41,1.18.53.6.18,1.22.22,1.84.27.7.16,1.42.24,2.13.29.44.02.88.02,1.31-.04.66-.02,1.32-.11,1.97-.2.72-.09,1.44-.22,2.14-.4.66-.17,1.34-.29,1.98-.51.9-.3,1.74-.74,2.54-1.24,1.37-.83,2.52-1.99,3.53-3.24.43-.55.85-1.11,1.22-1.71.38-.66.64-1.38.91-2.08.08-.22.16-.44.24-.69.13-.52.08-1.07.14-1.6.1-.76.15-1.53,0-2.29Zm-.97,1.31s0,0,0,.01c0,0,0,0,0,0,0,0,0-.01,0-.02ZM18.49,3.47c.34.04.68.07,1.01.16.87.28,1.77.57,2.56,1.05.31.19.64.34.95.54.52.35.96.79,1.4,1.22-.01,0-.03-.02-.06-.04-.19-.14-.37-.29-.55-.44-.98-.78-2.1-1.36-3.28-1.78-.45-.2-.92-.35-1.38-.5-.24-.08-.48-.16-.72-.23.03,0,.05,0,.08,0ZM3.5,16.44s-.03,0-.04,0c0,0,0,0,0,0,.01-.1.04-.2.06-.3-.01.1-.02.2-.02.3Zm3.62,10.42c-.16-.13-.3-.27-.45-.4,0,0,.02,0,.02,0,.02-.03.03-.06.04-.09.19.15.38.3.58.44.36.33.76.63,1.17.91-.52-.16-.96-.48-1.36-.84Zm13.56.46s.08-.04.13-.06c0,0,.02,0,.02,0-.05.02-.1.03-.15.05Zm3.09-1.8s.02-.01.03-.02c.49-.43,1-.87,1.47-1.33-.46.49-.97.94-1.49,1.35Zm.28-1.68c-.93,1.02-1.89,2.02-3.04,2.79-.71.48-1.53.75-2.35,1.01-.19.07-.4.11-.59.16-.01,0-.03-.01-.04,0-.02,0-.03.02-.04.03-.42.1-.84.18-1.27.24-.12.02-.24.05-.35.07-.08-.01-.16.02-.24.03-.5.12-1.02.1-1.53.15-1.47,0-2.99-.05-4.4-.49-.73-.27-1.42-.63-2.09-1.02-.44-.23-.77-.53-1.12-.9-.71-.75-1.25-1.58-1.73-2.49-.25-.45-.47-.92-.66-1.4-.02-.22-.08-.43-.11-.65-.1-.72-.18-1.45-.34-2.16-.12-.62-.22-1.24-.26-1.87.04-.35.09-.7.15-1.05.23-1.26.57-2.57,1.1-3.75.28-.55.63-1.07.96-1.59.91-1.45,1.99-2.8,3.31-3.9.43-.42.95-.73,1.46-1.05.6-.41,1.24-.77,1.87-1.11.14-.06.29-.12.43-.18.55-.21,1.14-.26,1.71-.37.68-.16,1.38-.08,2.07-.02.93.2,1.85.46,2.75.79.7.37,1.37.81,2,1.28.5.42.96.89,1.45,1.32,1.25,1.21,2.29,2.62,3.29,4.03.14.26.25.55.38.82.04.09.08.17.18.2.25.53.33,1.11.43,1.68.09.53.2,1.03.19,1.57-.05.61-.03,1.22-.08,1.83-.02.2-.06.4-.09.59-.2.4-.4.8-.6,1.22-.3.61-.57,1.24-.92,1.83-.53.86-1.18,1.65-1.87,2.38Zm4.13-4.3c-.21.57-.45,1.15-.71,1.71-.37.68-.85,1.28-1.31,1.89,0,0,0,0-.01.01.55-.77.97-1.62,1.41-2.45.28-.51.54-1.04.77-1.58-.05.14-.1.27-.15.42Zm-2.17,4.85c-.37.57-.89,1.05-1.39,1.52-.29.26-.6.49-.92.7-.15.11-.07.36.11.38.55-.12,2.3-1.82,2.56-2.36.08-.21-.18-.38-.35-.24ZM7.04,7.46c.4-.63.98-1.11,1.57-1.55.49-.39.99-.77,1.54-1.08.24-.15.02-.5-.22-.36-.54.3-1.04.67-1.52,1.06-.55.42-1.09.86-1.52,1.41-.14.18-.25.38-.37.58-.06.1-.01.24.09.29.24.12.34-.19.44-.34Z"/>' +
    '</svg>'
  );

  function resize() {
    canvas.width  = window.innerWidth  * DPR;
    canvas.height = window.innerHeight * DPR;
  }
  resize();
  window.addEventListener("resize", resize);

  function tick() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, w, h);

    if (phase === "grow") {
      const progress = LOADER_TOTAL > 0 ? Math.min(loaderCount / LOADER_TOTAL, 1) : 0;
      const targetR  = DOT_MIN_R + (DOT_MAX_R - DOT_MIN_R) * progress;
      smoothR += (targetR - smoothR) * 0.08;

      dotX = w / 2;
      dotY = h / 2;
      dotR = smoothR;

      drawDot(dotX, dotY, dotR, rot);

      if (loaderReady && Math.abs(smoothR - DOT_MAX_R) < 0.5) {
        curveR       = Math.min(w, h) * 0.4;
        curveCx      = w / 2 + curveR;
        curveCy      = h / 2;
        curveAlpha   = Math.PI;
        rollSubPhase = "curve";
        phase        = "roll";
        vel          = 0;
      }
    } else if (phase === "roll") {
      vel += RAMP_ACCEL;

      if (rollSubPhase === "curve") {
        const dAlpha = vel / curveR;
        curveAlpha  -= dAlpha;
        rot         += vel / dotR;
        dotX = curveCx + curveR * Math.cos(curveAlpha);
        dotY = curveCy + curveR * Math.sin(curveAlpha);

        if (curveAlpha <= Math.PI / 2) {
          curveAlpha   = Math.PI / 2;
          rollSubPhase = "exit";
          dotX = curveCx;
          dotY = curveCy + curveR;
        }
      } else {
        dotX += vel;
        rot  += vel / dotR;
      }

      drawDot(dotX, dotY, dotR, rot);

      if (dotX - dotR > w) {
        phase = "fade";
        loaderEl.classList.add("fade-out");
        loaderEl.addEventListener("transitionend", () => {
          loaderEl.remove();
          phase = "done";
        }, { once: true });
      }
    }

    if (phase !== "done") {
      requestAnimationFrame(tick);
    } else {
      window.removeEventListener("resize", resize);
    }
  }

  function drawDot(x, y, r, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (svgImg.complete && svgImg.naturalWidth > 0) {
      ctx.drawImage(svgImg, -r, -r, 2 * r, 2 * r);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }

    ctx.restore();
  }

  requestAnimationFrame(tick);
})();

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
let artImages = {};

// ----- World / player / input -----
let player;
let cameraX = 0;
let world;
let keys = {};

let activeObject = null;
let isDialogOpen = false;

// ----- Animation state -----
let animState  = "idle";
let animFrame  = 0;
let animTick   = 0;
let animDir    = 1;          // 1 = forward, -1 = reverse (used by interact)
let facing     = "right";
let isInteracting = false;

// ----- Navigation bar -----
const NAV_X0 = 1100, NAV_X1 = 1560, NAV_Y = 45;
const NAV_R = 8, NAV_R_ACTIVE = 14, NAV_R_INNER = 5;
const NAV_HIT_R = 20;
let navProjects = [];
let activeNavIndex = 0;
let navDotSizes = [];

// ----- Teleport transition -----
let teleportState = "none";
let teleportAlpha  = 0;
let teleportTick   = 0;
let pendingNavIdx  = -1;
const TELEPORT_FADE_FRAMES = 18;
const TELEPORT_HOLD_FRAMES = 30;

// ----- Dialog overlay state machine -----
let dialogPhase = "none";

// ----- Instruction panel -----
let lastActivityTime = 0;
let instructionShown = true;

function preload() {
  spriteSheet = loadImage("VisualAssests/Animation/Sprite.png", loaderTrack);
  bgImage     = loadImage("VisualAssests/background.png", loaderTrack);
  fgImage     = loadImage("VisualAssests/foreground.png", loaderTrack);
  artImages["01_01"]   = loadImage("VisualAssests/01-01.png", loaderTrack);
  artImages["01_02"]   = loadImage("VisualAssests/01-02.png", loaderTrack);
  artImages["01_F"]    = loadImage("VisualAssests/01-F.png", loaderTrack);

  artImages["02_01_1"] = loadImage("VisualAssests/02-01-1.png", loaderTrack);
  artImages["02_01_2"] = loadImage("VisualAssests/02-01-2.png", loaderTrack);
  artImages["02_02_1"] = loadImage("VisualAssests/02-02-1.png", loaderTrack);
  artImages["02_02_2"] = loadImage("VisualAssests/02-02-2.png", loaderTrack);
  artImages["02_F_1"]  = loadImage("VisualAssests/02-F-1.png", loaderTrack);
  artImages["02_F_2"]  = loadImage("VisualAssests/02-F-2.png", loaderTrack);
  artImages["02_F_3"]  = loadImage("VisualAssests/02-F-3.png", loaderTrack);
  artImages["02_F_4"]  = loadImage("VisualAssests/02-F-4.png", loaderTrack);
  artImages["02_F_5"]  = loadImage("VisualAssests/02-F-5.png", loaderTrack);
  artImages["02_F_6"]  = loadImage("VisualAssests/02-F-6.png", loaderTrack);

  artImages["03_01_1"] = loadImage("VisualAssests/03-01-1.png", loaderTrack);
  artImages["03_01_2"] = loadImage("VisualAssests/03-01-2.png", loaderTrack);
  artImages["03_01_3"] = loadImage("VisualAssests/03-01-3.png", loaderTrack);
  artImages["03_01_4"] = loadImage("VisualAssests/03-01-4.png", loaderTrack);
  artImages["03_02"]   = loadImage("VisualAssests/03-02.png", loaderTrack);
  artImages["03_03"]   = loadImage("VisualAssests/03-03.png", loaderTrack);
  artImages["4_F"]     = loadImage("VisualAssests/4F.png", loaderTrack);
}

function setup() {
  loaderReady = true;

  const c = createCanvas(BASE_W, BASE_H);
  c.parent("stage");
  textFont("Gloria Hallelujah");
  frameRate(60);
  imageMode(CORNER);

  fitCanvasToWindow();

  let s1 = 1500;
  let s2 = 8500;
  let s3 = 25000;

  world = {
    width: s3+14000,
    groundY: 660,
    backgroundObjects: [
      { x:  4800, y: 180, w: 900, h: 600, art: "02_01_1", title: "02_01_1", text: "" },
    ],
    objects: [
      // Section 1
      { x:   s1, y: 370, w: 450, h: 450, art: "01_01",   title: "01_01",   name: "Space Balloon",     text: "A quiet beginning. What can we do with text? Shapes?", url: "https://benjijiang.github.io/ATW-01-01/" },
      { x:  s1+2000, y: 530, w: 200, h: 200, art: "01_02",   title: "01_02",   name: "Still Life",   text: "An abstraction of form. Two books, a color wheel.", url: "https://benjijiang.github.io/ATW-01-02/" },
      { x:  s1+4000, y:  630, w: 950, h: 240, art: "01_F",    title: "01_F",    name: "Sea of Books",      text: "My fingertips drift across the pages, lost in the quiet world between the lines.", url: "https://benjijiang.github.io/ATW-01-02/sea-of-books/index.html" },

      // Section 2
      { x:  s2, y: 510, w: 200, h: 200, art: "02_01_2", title: "02_01_2", name: "Web Ring", text: "A connected loop to all. We end where we started.", url: "https://benjijiang.github.io/ATW-01-02/" },
      { x:  s2+1500, y:   0, w: 950, h: 850, art: "02_02_1", title: "02_02_1", name: "Black Swan", text: "Searching through the veil, finding form within abstraction.", url: "https://benjijiang.github.io/ATW-02-02/" },
      { x: s2+5000, y: 570, w: 120, h: 120, art: "02_F_1",  title: "02_F_1",  text: "", noInteract: true },
      { x: s2+6700, y: 570, w: 120, h: 120, art: "02_F_2",  title: "02_F_2",  text: "", noInteract: true },
      { x: s2+8400, y: 570, w: 100, h: 100, art: "02_F_3",  title: "02_F_3",  text: "", noInteract: true },
      { x: s2+11000, y: 585, w: 100, h: 100, art: "02_F_4",  title: "02_F_4",  name: "Poem of Time", text: "Let us wait. Let time write all that is yet to be written.", url: "https://benjijiang.github.io/ATW-02-Final/" },
      { x: s2+12700, y: 565, w: 120, h: 120, art: "02_F_5",  title: "02_F_5",  text: "", noInteract: true },
      { x: s2+14400, y: 545, w: 140, h: 140, art: "02_F_6",  title: "02_F_6",  text: "", noInteract: true },

      // s3+8000

      // Section 3
      { x: s3, y: 358, w: 350, h: 350, art: "03_01_1", title: "03_01_1", text: "", noInteract: true },
      { x: s3+2000, y: 323, w: 380, h: 380, art: "03_01_2", title: "03_01_2", text: "", noInteract: true },
      { x: s3+4000, y: 138, w: 600, h: 600, art: "03_01_3", title: "03_01_3", name: "Instructions", text: "Try to chase uncertainty. Following the script only makes life dull.", url: "https://jasmine-wng.github.io/s3q1/index.html" },
      { x: s3+6000, y: 340, w: 350, h: 350, art: "03_01_4", title: "03_01_4", text: "", noInteract: true },
      { x: s3+8000, y: 580, w: 150, h: 100, art: "03_02", title: "03_02",     name: "IF?", text: "It would be simpler if everything is a if statement.", url: "https://smr-ptk.github.io/AotW-S3A2/" },
      { x: s3+10500, y: 65, w: 1000, h: 700, art: "03_03", title: "03_03",    name: "Rain", text: "I love standing in the raining.", url: "https://benjijiang.github.io/ATW-03-Final/" },
      // End of world marker
      { x: s3+13200, y: -200, w: 1200, h: 1200, art: "4_F", title: "4_F", text: "", noInteract: true }
    ]
  };

  // Character on-canvas display size. The sprite cell is 1254 but the figure
  // only fills ~55% of it, so we use a generous draw box for a moderate look.
  player = {
    x: 200,
    drawW: 250,
    drawH: 250,
    speed: 7
  };

  player.y = world.groundY - player.drawH * 0.92;

  const artKeys = ["01_01", "01_02", "01_F", "02_01_2", "02_02_1", "02_F_4", "03_01_3", "03_02", "03_03"];
  for (const key of artKeys) {
    const obj = world.objects.find(o => o.art === key);
    if (obj) navProjects.push({ id: key, obj });
  }
  navDotSizes = new Array(navProjects.length).fill(NAV_R);

  lastActivityTime = Date.now();
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
  const cv = document.querySelector("#stage canvas");
  if (cv) {
    cv.style.width  = cssW + "px";
    cv.style.height = cssH + "px";
  }
  const s = cssW / BASE_W;
  const overlay = document.getElementById("dialog-overlay");
  if (overlay) {
    overlay.style.transform = `translate(-50%, -50%) scale(${s})`;
  }
  const instrPanel = document.getElementById("instruction-panel");
  if (instrPanel) {
    instrPanel.style.transform = `translate(-50%, -50%) scale(${s})`;
  }
}

// ---------------- main loop ----------------
function draw() {
  updateTeleport();

  if (!isDialogOpen && teleportState === "none" && dialogPhase === "none") {
    updatePlayer();
    updateCamera();
    updateInteraction();
    updateActiveNavDot();
  }
  updateAnimation();

  renderScene();

  if (teleportState !== "none") {
    noStroke();
    fill(0, teleportAlpha);
    rect(0, 0, width, height);
    drawPlayerAtScreen();
  }

  if (activeObject && teleportState === "none" && dialogPhase === "none") {
    drawInteractionHint(activeObject);
  }

  updateNavDotSizes();
  drawNavBar();

  if (!instructionShown && Date.now() - lastActivityTime > 10000) {
    instructionShown = true;
    document.getElementById("instruction-panel").classList.remove("instr-hidden");
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
  player.x = constrain(player.x, 0, world.width - 600 - player.drawW);

  // Movement interrupts a reverse look-up so walking feels responsive.
  if (isInteracting && animDir === -1 && moving) {
    isInteracting = false;
    animDir = 1;
  }

  if (!isInteracting) {
    const next = moving ? "walk" : "idle";
    if (next !== animState) {
      animState = next;
      animFrame = 0;
      animTick  = 0;
      animDir   = 1;
    }
  }
}

function updateAnimation() {
  const cfg = ANIM[animState];
  animTick++;
  if (animTick < cfg.speed) return;
  animTick = 0;
  animFrame += animDir;

  if (animState === "interact") {
    if (animDir === 1 && animFrame >= cfg.frames) {
      animFrame = cfg.frames - 1;
      isInteracting = false;
      if (dialogPhase === "animating_open") {
        openDialogOverlay(activeObject);
      }
    } else if (animDir === -1 && animFrame < 0) {
      animFrame = 0;
      animDir = 1;
      isInteracting = false;
      animState = "idle";
      if (dialogPhase === "animating_close") {
        dialogPhase = "none";
      }
    }
  } else {
    if (animFrame >= cfg.frames) animFrame = 0;
    if (animFrame < 0)           animFrame = cfg.frames - 1;
  }
}

function updateCamera() {
  cameraX = player.x - width / 2 + player.drawW / 2;
  cameraX = constrain(cameraX, 0, world.width - width);
}

function updateInteraction() {
  activeObject = null;
  for (let obj of world.objects) {
    if (obj.noInteract) continue;
    const objCenter    = obj.x + obj.w / 2;
    const playerCenter = player.x + player.drawW / 2;
    if (abs(playerCenter - objCenter) <= obj.w / 2 + 150) {
      activeObject = obj;
      break;
    }
  }
}

function updateActiveNavDot() {
  const px = player.x + player.drawW / 2;
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < navProjects.length; i++) {
    const obj = navProjects[i].obj;
    const d = abs(px - (obj.x + obj.w / 2));
    if (d < bestDist) { bestDist = d; bestIdx = i; }
  }
  activeNavIndex = bestIdx;
}

// ---------------- render ----------------
function renderScene() {
  background(248, 246, 240);

  // Draw order (back -> front):
  //   1. background          (parallax sky)
  //   2. background objects  (scene props behind the ground line)
  //   3. foreground          (looping floor line)
  //   4. player
  //   5. objects             (interactive artwork pieces)
  // drawBackground();

  push();
  translate(-cameraX / 1.75, 0);
  drawBackgroundObjects();
  pop();

  drawForeground();

  push();
  translate(-cameraX, 0);
  drawPlayer();
  drawObjects();
  pop();

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
// character. Drawn above the background but below objects/character.
function drawForeground() {
  if (!fgImage) return;
  const fgRatio = fgImage.width / fgImage.height;
  const fgH = 260;
  const fgW = fgH * fgRatio;
  // The horizon line inside the source image is roughly 88% down the asset.
  const fgY = world.groundY - fgH * 0.88;

  // Cover any background bleed below the horizon with the page color so the
  // foreground strip seamlessly meets the bottom of the canvas.
  noStroke();
  fill("#FBF8F5");
  rect(0, world.groundY, width, height - world.groundY);

  let startX = -((cameraX) % fgW);
  if (startX > 0) startX -= fgW;
  for (let x = startX; x < width; x += fgW) {
    image(fgImage, x, fgY, fgW, fgH);
  }
}

function drawObjects() {
  for (let obj of world.objects) {
    const isNear = activeObject === obj && !isDialogOpen;

    if (obj.art && artImages[obj.art]) {
      image(artImages[obj.art], obj.x, obj.y, obj.w, obj.h);
    } else {
      noFill();
      stroke(isNear ? 40 : 130);
      strokeWeight(isNear ? 2 : 1.2);
      rect(obj.x, obj.y, obj.w, obj.h);
    }
  }
}

// Background-visual objects: same placement schema as `objects`, but drawn
// behind the foreground (and behind the player). Non-interactive.
function drawBackgroundObjects() {
  if (!world.backgroundObjects) return;
  drawingContext.filter = "blur(20px)";
  for (let obj of world.backgroundObjects) {
    if (obj.art && artImages[obj.art]) {
      image(artImages[obj.art], obj.x, obj.y, obj.w, obj.h);
    }
  }
  drawingContext.filter = "none";
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

function updateNavDotSizes() {
  for (let i = 0; i < navProjects.length; i++) {
    const target = (i === activeNavIndex) ? NAV_R_ACTIVE : NAV_R;
    navDotSizes[i] = lerp(navDotSizes[i], target, 0.15);
  }
}

function drawNavBar() {
  if (navProjects.length < 2) return;
  const count = navProjects.length;
  const spacing = (NAV_X1 - NAV_X0) / (count - 1);

  stroke(0);
  strokeWeight(2);
  line(NAV_X0, NAV_Y, NAV_X1, NAV_Y);

  noStroke();
  for (let i = 0; i < count; i++) {
    const x = NAV_X0 + i * spacing;
    const r = navDotSizes[i] || NAV_R;
    fill(0);
    circle(x, NAV_Y, r * 2);
    const innerR = constrain(map(r, NAV_R, NAV_R_ACTIVE, 0, NAV_R_INNER), 0, NAV_R_INNER);
    if (innerR > 0.5) {
      fill(255);
      circle(x, NAV_Y, innerR * 2);
    }
  }
}

// ---------------- instruction panel ----------------
function recordActivity() {
  lastActivityTime = Date.now();
  if (instructionShown) {
    instructionShown = false;
    setTimeout(() => {
      document.getElementById("instruction-panel").classList.add("instr-hidden");
    }, 1000);
  }
}

// ---------------- interaction ----------------
function tryInteract() {
  if (!activeObject || dialogPhase !== "none") return;
  isInteracting = true;
  animState = "interact";
  animFrame = 0;
  animTick  = 0;
  animDir   = 1;
  dialogPhase = "animating_open";
}

function navigateToProject(idx) {
  if (idx < 0 || idx >= navProjects.length) return;
  if (teleportState !== "none") return;
  document.getElementById("dialog-overlay").classList.remove("dialog-visible");
  document.getElementById("dialog-iframe").src = "about:blank";
  dialogPhase = "none";
  pendingNavIdx = idx;
  isDialogOpen = false;
  teleportState = "fade_out";
  teleportAlpha = 0;
  teleportTick  = 0;
}

function closeDialog() {
  const overlay = document.getElementById("dialog-overlay");
  overlay.classList.remove("dialog-visible");
  overlay.addEventListener("transitionend", function handler() {
    overlay.removeEventListener("transitionend", handler);
    document.getElementById("dialog-iframe").src = "about:blank";
    isDialogOpen = false;
    dialogPhase = "animating_close";
    animState = "interact";
    isInteracting = true;
    animDir = -1;
    animTick = 0;
    animFrame = constrain(animFrame, 0, ANIM.interact.frames - 1);
  }, { once: true });
}

function openDialogOverlay(obj) {
  if (!obj) return;
  const titleEl = document.getElementById("dialog-title");
  const displayName = obj.name || obj.title;
  if (obj.url) {
    titleEl.innerHTML = `<a href="${obj.url}" target="_blank">${displayName}</a>`;
  } else {
    titleEl.textContent = displayName;
  }
  document.getElementById("dialog-text").textContent = obj.text;
  const iframe = document.getElementById("dialog-iframe");
  const clickLayer = document.getElementById("dialog-preview-click");
  iframe.src = obj.url || "about:blank";
  clickLayer.onclick = obj.url ? () => window.open(obj.url, "_blank") : null;
  document.getElementById("dialog-overlay").classList.add("dialog-visible");
  isDialogOpen = true;
  dialogPhase = "open";
}

function updateTeleport() {
  if (teleportState === "none") return;
  teleportTick++;
  if (teleportState === "fade_out") {
    teleportAlpha = map(teleportTick, 0, TELEPORT_FADE_FRAMES, 0, 255);
    if (teleportTick >= TELEPORT_FADE_FRAMES) {
      const obj = navProjects[pendingNavIdx].obj;
      player.x = constrain(obj.x - 150, 0, world.width - 500 - player.drawW);
      updateCamera();
      activeObject   = obj;
      activeNavIndex = pendingNavIdx;
      teleportState  = "hold";
      teleportAlpha  = 255;
      teleportTick   = 0;
    }
  } else if (teleportState === "hold") {
    if (teleportTick >= TELEPORT_HOLD_FRAMES) {
      teleportState = "fade_in";
      teleportTick  = 0;
    }
  } else if (teleportState === "fade_in") {
    teleportAlpha = map(teleportTick, 0, TELEPORT_FADE_FRAMES, 255, 0);
    if (teleportTick >= TELEPORT_FADE_FRAMES) {
      teleportAlpha = 0;
      teleportState = "none";
      tryInteract();
    }
  }
}

function drawPlayerAtScreen() {
  if (!spriteSheet) return;
  const cfg = ANIM[animState];
  const sx = animFrame * SPRITE_CELL;
  const sy = cfg.row   * SPRITE_CELL;
  const screenX = player.x - cameraX;
  push();
  if (facing === "left") {
    translate(screenX + player.drawW, player.y);
    scale(-1, 1);
    image(spriteSheet, 0, 0, player.drawW, player.drawH, sx, sy, SPRITE_CELL, SPRITE_CELL);
  } else {
    image(spriteSheet, screenX, player.y, player.drawW, player.drawH, sx, sy, SPRITE_CELL, SPRITE_CELL);
  }
  pop();
}

// ---------------- mouse ----------------
function mousePressed() {
  recordActivity();
  if (navProjects.length < 2) return;
  const count = navProjects.length;
  const spacing = (NAV_X1 - NAV_X0) / (count - 1);
  for (let i = 0; i < count; i++) {
    const dotX = NAV_X0 + i * spacing;
    if (dist(mouseX, mouseY, dotX, NAV_Y) < NAV_HIT_R) {
      navigateToProject(i);
      return;
    }
  }
}

// ---------------- keys ----------------
function keyPressed() {
  recordActivity();
  keys[key] = true;
  keys[keyCodeToName(keyCode)] = true;

  if (!isDialogOpen && (key === "w" || key === "W" || keyCode === UP_ARROW)) {
    tryInteract();
  }
  if (isDialogOpen && dialogPhase === "open") {
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
