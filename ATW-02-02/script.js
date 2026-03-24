function BezierModule({ name, tStart, alpha, speed, offsetBase }) {
  return function (p) {
    let t = tStart;

    p.setup = function () {
      const c = p.createCanvas(400, 400);
      c.parent(name);
      p.stroke(0, alpha);
      p.noFill();
      p.background(255);
    };

    p.draw = function () {
      const x1 = p.width  * p.noise(t + offsetBase + 10);
      const x2 = p.width  * p.noise(t + offsetBase + 20);
      const x3 = p.width  * p.noise(t + offsetBase + 30);
      const x4 = p.width  * p.noise(t + offsetBase + 40);
      const y1 = p.height * p.noise(t + offsetBase + 50);
      const y2 = p.height * p.noise(t + offsetBase + 60);
      const y3 = p.height * p.noise(t + offsetBase + 70);
      const y4 = p.height * p.noise(t + offsetBase + 80);

      p.bezier(x1, y1, x2, y2, x3, y3, x4, y4);
      t += speed;
    };
  };
}

new p5(BezierModule({ name: "c1", tStart: 5.0, alpha: 2, speed: 0.005, offsetBase: 0 }));
new p5(BezierModule({ name: "c2", tStart: 3.0, alpha: 5, speed: 0.003, offsetBase: 10 }));
new p5(BezierModule({ name: "c3", tStart: 1.0, alpha: 10, speed: 0.003, offsetBase: 20}));
new p5(BezierModule({ name: "c4", tStart: 0.5, alpha: 15, speed: 0.003, offsetBase: 30 }));
new p5(BezierModule({ name: "c5", tStart: 0.1, alpha: 20, speed: 0.003, offsetBase: 40 }));
new p5(BezierModule({ name: "c6", tStart: 2.0, alpha: 50, speed: 0.002, offsetBase: 50 }));