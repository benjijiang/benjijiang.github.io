let particles = [];
const num = 10000; 
const noiseScale = 0.01;
const angle = 0.2;
let zoff = 0; // Initialize zoff so we can add to it later!

let Colors = ['#b0b4f5','#e4d5f7','#00000','#fabebe','#ff0000'];

function setup() {
    createCanvas(1000, 800);
    for(let i = 0; i < num; i++) {
        // Create an object holding both the position AND a random color
        particles.push({
            pos: createVector(random(width), random(height)),
            color: random(Colors) // p5.js random() automatically picks one item from an array!
        });
    }
    clear();
}

function draw() {
    background(0,10);
    
    for(let i = 0; i < num; i++){
        let p = particles[i]; // p is now an object: { pos, color }
        
        // Apply this specific particle's color before drawing the point
        stroke(p.color);
        point(p.pos.x, p.pos.y);
        
        // Calculate movement using p.pos instead of just p
        let n = noise(p.pos.x * noiseScale, p.pos.y * noiseScale, zoff);
        let a = angle * TAU * n; 
        
        let moveVec = p5.Vector.fromAngle(a);

        let d = dist(mouseX, mouseY, p.pos.x, p.pos.y);
        let radius = 80;

        if (d < radius) {
            let pushVec = createVector(p.pos.x - mouseX, p.pos.y - mouseY);
            pushVec.normalize();
            
            let strength = map(d, 0, radius, 1, 0);
            moveVec.lerp(pushVec, strength);
        }
        moveVec.normalize();

        p.pos.x += moveVec.x;
        p.pos.y += moveVec.y;
        
        // Check if it's off screen
        if (!onScreen(p.pos)){
            p.pos.x = random(width);
            p.pos.y = random(height);
            // Give it a brand new random color when it respawns!
            p.color = random(Colors); 
        }
    }
    
    // Increment zoff so the noise field slowly shifts over time
    zoff += 0.002; 
}

function onScreen(v){
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}