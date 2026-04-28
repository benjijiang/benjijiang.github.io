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

let lightrain;
let midrain;
let heavyrain;

let currentSound = null;

function preload() {
  soundFormats('mp3');
  lightrain = loadSound('gentle-rain.mp3');
  midrain = loadSound('mid-rain.mp3');
  heavyrain = loadSound('large-rain.mp3');
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
    matchRain();
    swapLabel(LEVEL_LABELS[currentLevel]);
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
    fadeOut(currentSound);
    currentSound = null;
    swapLabel('The rain is ▶ed');
    return;
  };

  if (keyCode === UP_ARROW && currentLevel < RAIN_LEVELS.length - 1) {
    currentLevel++;
    applyLevel();
    matchRain();
  } else if (keyCode === DOWN_ARROW && currentLevel > 0) {
    currentLevel--;
    applyLevel();
    matchRain();
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

  swapLabel(LEVEL_LABELS[currentLevel]);
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

function swapLabel(newText) {
  let label = document.getElementById('rain-label');
  if (!label) return;
  label.style.opacity = '0';
  setTimeout(() => {
    label.textContent = newText;
    label.style.opacity = '1';
  }, 400);
}

function windowResized() {
  if (isActive) {
    resizeCanvas(windowWidth, windowHeight);
    centerX = width / 2;
    centerY = height / 2;
  }
}

function matchRain() {
  // 根据 level 决定应该播哪个音
  let targetSound;
  if (currentLevel <= 1) {
    targetSound = lightrain;
  } else if (currentLevel === 2) {
    targetSound = midrain;
  } else {
    targetSound = heavyrain;
  }

  // 如果已经是同一个音频在播放，不做任何事
  if (targetSound === currentSound && currentSound && currentSound.isPlaying()) return;

  // 不同音频：淡出旧的，播放新的
  fadeOut(currentSound);
  targetSound.loop();
  fadeIn(targetSound);
  currentSound = targetSound;
}

// sound fadein abstraction
function fadeIn(sound, duration = 1000) {
  if (!sound || !sound.isPlaying()) return;
  sound.setVolume(1, duration / 1000); // p5.js 的 rampTo 时间单位是秒
}

// sound fadeout abstraction
function fadeOut(sound, duration = 1000) {
  if (!sound || !sound.isPlaying()) return;
  sound.setVolume(0, duration / 1000); // p5.js 的 rampTo 时间单位是秒
  setTimeout(() => {
    sound.stop();
  }, duration + 100); // 稍微多等一点，确保淡出完成
}