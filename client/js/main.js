console.log(window.innerHeight)

let sketch = function (p) {
    p.setup = function () {
        p.createCanvas(window.innerWidth, window.innerHeight * 2);
        p.noStroke();
        p.frameRate(30);
        gravity = draw.createVector(0, 0.03);
        let parent = new Circle(window.innerWidth / 2, window.innerHeight / 3, 100,255)
        system.addCircle(parent);
        p.cursor(p.HAND);
    };

    p.draw = function () {
        p.background(102);
        system.circles.forEach((c, i) => {
            c.update();
            c.display();
        })
    };
};

let draw = new p5(sketch);

const system = new System();
system.initControls();
system.initModal();

