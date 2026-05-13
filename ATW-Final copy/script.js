let player;
let cameraX = 0;
let world;
let keys = {};

let interactionRange = 80;
let activeObject = null;
let isDialogOpen = false;

function setup() {
  createCanvas(800, 400);
  textFont("Gloria Hallelujah");
  frameRate(120);

  world = {
    width: 3000,
    groundY: 320,
    objects: [
      {
        x: 300,
        y: 280,
        w: 40,
        h: 40,
        title: "01_01",
        text: "A quiet beginning. A space ballon."
      },
      {
        x: 800,
        y: 250,
        w: 60,
        h: 70,
        title: "03_03",
        text: "An attempt to make something alive."
      },
      {
        x: 1400,
        y: 260,
        w: 80,
        h: 60,
        title: "02_02",
        text: "I forgot what this was..."
      },
      {
        x: 2100,
        y: 230,
        w: 50,
        h: 90,
        title: "02_03",
        text: "A piece about time."
      }
    ]
  };

  player = {
    x: 100,
    y: world.groundY - 30,
    w: 30,
    h: 30,
    speed: 4
  };
}

//loooooop 
function draw() {
  if (!isDialogOpen) {
    updatePlayer();
    updateCamera();
    updateInteraction();
  }

  renderScene();

  if (isDialogOpen && activeObject) {
    drawDialog(activeObject);
  } else if (activeObject) {
    drawInteractionHint(activeObject);
  }
}

function updatePlayer() {
  if (keys["a"] || keys["ArrowLeft"]) {
    player.x -= player.speed;
  }
  if (keys["d"] || keys["ArrowRight"]) {
    player.x += player.speed;
  }

  player.x = constrain(player.x, 0, world.width - player.w);
}

function updateCamera() {
  cameraX = player.x - width / 2 + player.w / 2;
  cameraX = constrain(cameraX, 0, world.width - width);
}

function updateInteraction() {
  activeObject = null;

  for (let obj of world.objects) {
    let objCenter = obj.x + obj.w / 2;
    let playerCenter = player.x + player.w / 2;
    let dist = abs(playerCenter - objCenter);

    if (dist <= interactionRange) {
      activeObject = obj;
      break;
    }
  }
}

function renderScene() {
    background(0);
  
    push();
    translate(-cameraX, 0);
    drawWorld();
    drawObjects();
    drawPlayer();
    pop();
  
    if (isDialogOpen) {
      drawDarkOverlay();
    }
  }

//background black, just draw line
function drawWorld() {
  stroke(255);
  strokeWeight(1.5);
  line(0, world.groundY, world.width, world.groundY);

  // a few simple background lines for vibes
  stroke(100);
  line(0, 120, world.width, 100);
  line(0, 170, world.width, 190);
}

function drawObjects() {
  noFill();

  for (let obj of world.objects) {
    let isNear = activeObject === obj && !isDialogOpen;

    if (isNear) {
      stroke(255);
      strokeWeight(2);
    } else {
      stroke(180);
      strokeWeight(1);
    }

    rect(obj.x, obj.y, obj.w, obj.h);
  }
}

function drawPlayer() {
  fill(255);
  noStroke();
  rect(player.x, player.y, player.w, player.h);
}

function drawInteractionHint(obj) {
  fill(255);
  noStroke();
  textAlign(CENTER);
  textSize(14);
  text("W or ⬆ to interact", width / 2, height - 30);
}

function drawDarkOverlay() {
  fill(0, 170);
  noStroke();
  rect(0, 0, width, height);
}

function drawDialog(obj) {
  let cx = width / 2;
  let topY = 60;

  textAlign(CENTER, TOP);
  noStroke();

  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 2;

  // title
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.9)';
  drawingContext.shadowBlur = 18;
  fill(255);
  textSize(20);
  text(obj.title, cx, topY);

  // body
  drawingContext.shadowBlur = 14;
  fill(235);
  textSize(15);
  textLeading(24);
  text(obj.text, cx, topY + 34);

  // exit hint
  drawingContext.shadowBlur = 8;
  fill(180);
  textSize(12);
  text("ESC to return", cx, topY + 100);

  drawingContext.shadowColor = 'transparent';
  drawingContext.shadowBlur = 0;
  drawingContext.shadowOffsetY = 0;
}

function tryInteract() {
  if (activeObject && !isDialogOpen) {
    isDialogOpen = true;
  }
}

function closeDialog() {
  isDialogOpen = false;
}

//keypress functions
function keyPressed() {
  keys[key] = true;
  keys[keyCodeToName(keyCode)] = true;

  if (!isDialogOpen && (key === "w" || key === "W" || keyCode === UP_ARROW)) {
    tryInteract();
  }

  if (isDialogOpen && keyCode === ESCAPE) {
    closeDialog();
  }

  // prevent browser / p5 default behavior for arrows / esc if needed
  return false;
}

function keyReleased() {
  keys[key] = false;
  keys[keyCodeToName(keyCode)] = false;
}

function keyCodeToName(code) {
  if (code === LEFT_ARROW) return "ArrowLeft";
  if (code === RIGHT_ARROW) return "ArrowRight";
  if (code === UP_ARROW) return "ArrowUp";
  return "";
}