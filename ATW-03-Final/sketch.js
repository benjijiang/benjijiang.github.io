const RAIN_LEVELS = [
  { dropCount: 80,  baselengthMax: 150, fps: 7  },
  { dropCount: 200, baselengthMax: 300, fps: 7  },
  { dropCount: 400, baselengthMax: 500, fps: 9  },
  { dropCount: 600, baselengthMax: 700, fps: 11 },
  { dropCount: 900, baselengthMax: 950, fps: 14 },
];

const LEVEL_LABELS = ["It's drizzling.", "Some gentle rain.", "It's raining.", "It's heavy rain.", "It's pouring."];

let drops = [];
let currentLevel = 2;
let currentBaselengthMax = 500;
let isActive = false;

let centerX;
let centerY;

let rainSound;

function preload() {
  soundFormats('mp3');
  rainSound = loadSound('boons_freak-rain-sound-188158.mp3',
    () => {},
    () => { rainSound = null; }
  );
}

function setup() {
  createCanvas(600, 400);
  centerX = width / 2;
  centerY = height / 2;

  let level = RAIN_LEVELS[currentLevel];
  currentBaselengthMax = level.baselengthMax;
  for (let i = 0; i < level.dropCount; i++) {
    drops.push(new RadialRaindrop());
  }

  noLoop();
}

function draw() {
  background('#7F93A4');

  for (let drop of drops) {
    drop.reset();
    drop.display();
  }
}

function keyPressed() {
  if (key === ' ' && !isActive) {
    isActive = true;
    document.body.classList.add('rain-active');
    resizeCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2;
    frameRate(RAIN_LEVELS[currentLevel].fps);
    loop();
    if (rainSound) rainSound.loop();
    return;
  }
 
  if (key === ' ' && isActive){
    isActive = false;
    document.body.classList.remove('rain-active');
    resizeCanvas(600, 400);
    centerX = width / 2;
    centerY = height / 2;
    noLoop();
    redraw();
    if (rainSound) {
      rainSound.setVolume(0, 1);
      setTimeout(() => {
        rainSound.stop();
        rainSound.setVolume(1);
      }, 1500);
    }
    return;
  };

  if (keyCode === UP_ARROW && currentLevel < RAIN_LEVELS.length - 1) {
    currentLevel++;
    applyLevel();
  } else if (keyCode === DOWN_ARROW && currentLevel > 0) {
    currentLevel--;
    applyLevel();
  }
}

function applyLevel() {
  let level = RAIN_LEVELS[currentLevel];
  currentBaselengthMax = level.baselengthMax;

  while (drops.length < level.dropCount) {
    drops.push(new RadialRaindrop());
  }
  while (drops.length > level.dropCount) {
    drops.pop();
  }

  frameRate(level.fps);

  let label = document.getElementById('rain-label');
  if (label) label.textContent = LEVEL_LABELS[currentLevel];
}

class RadialRaindrop {
  constructor() {
    this.reset();
    this.distance = random(0, max(width, height));
  }

  reset() {
    this.angle = random(PI*2);
    this.distance = random(15, 700);
    this.speed = random(0.5, 4);
    this.acceleration = random(0.04, 0.11);
    this.baselength = random(30, currentBaselengthMax);
    this.thickness = random(1.0, 2.75);
    // this.thickness = random(0.2, 1.0);
    this.opacity = random(150,220);
  }

  display() {
    let x = centerX + cos(this.angle) * this.distance;
    let y = centerY + sin(this.angle) * this.distance;

    //
    let stretch = map(this.distance, 0, max(width, height), 0.5, 3.5);
    let dropLength = this.baselength * stretch;

    // direction control
    let dx = cos(this.angle);
    let dy = sin(this.angle);

    let x2 = x + dx * dropLength;
    let y2 = y + dy * dropLength;

    stroke(180, 190, 205, this.opacity);
    strokeWeight(this.thickness);
    line(x, y, x2, y2);
  }
}

function windowResized() {
  if (isActive) {
    resizeCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2;
  }
}
