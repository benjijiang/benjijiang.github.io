let particles = [];
const num = 5000; 
const speed = 0.3;

let Colors = ['#b0b4f5','#e4d5f7','#00000','#90a2fc','#78d0ff'];

function setup() {
    createCanvas(600, 600);
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
    loadPixels();
        for (let i = 0; i < pixels.length; i += 4) {
            pixels[i + 3] = pixels[i + 3] * 0.95; // 逐渐降低每个像素的透明度
    }
    updatePixels();
    
    for(let i = 0; i < num; i++){
        let p = particles[i]; // p is now an object: { pos, color }
        
        // Apply this specific particle's color before drawing the point
        stroke(p.color);
        point(p.pos.x, p.pos.y);
        
        // Calculate movement using p.pos instead of just p
        let cx = width/2;
        let cy = height/2;
        let angleToCenter = atan2(p.pos.y - cy, p.pos.x - cx);
        let a = angleToCenter + HALF_PI; // 垂直于半径方向 = 圆形运动
        
        let moveVec = p5.Vector.fromAngle(a);

        let d = dist(mouseX, mouseY, p.pos.x, p.pos.y);
        let radius = 40;

        if (d < radius) {
            let pushVec = createVector(mouseX - p.pos.x, mouseY - p.pos.y);
            pushVec.normalize();
            
            let strength = map(d, 0, radius, 1, 0);
            moveVec.lerp(pushVec, strength);
        }
        moveVec.normalize();

        p.pos.x += moveVec.x * speed;
        p.pos.y += moveVec.y * speed;
        
        // Check if it's off screen
        // if (!onScreen(p.pos)){
        //     p.pos.x = random(width);
        //     p.pos.y = random(height)*2;
        //     // Give it a brand new random color when it respawns!
        //     p.color = random(Colors); 
        // }
    }
    
}

// function onScreen(v){
//     return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
// }