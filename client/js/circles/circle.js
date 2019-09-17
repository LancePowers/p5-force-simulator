class Circle {
    constructor(tx, ty, ts, color = 200) {
        this.position = draw.createVector(tx, ty);
        // Random start velocity
        // let x = Math.random() * 4
        // let y = Math.random() * 4
        this.velocity = draw.createVector(0, 0);
        this.acceleration = draw.createVector(0, 0)
        this.diameter = ts;
        this.radius = ts / 2;
        this.growth = 0;
        this.updates = {};
        this.displays = {};
        this.color = color;
    }
    applyForce(circle, type, config) {
        let apply = system.forceFactory.apply.bind(this)
        apply(circle, type, config)
    }
    display() {
        if (Object.entries(this.displays).length > 0) {
            for (const [key, display] of Object.entries(this.displays)) {                
                display();
            }
        } else {
            draw.fill(this.color);
            draw.ellipse(this.position.x, this.position.y, this.diameter);
        }
    }

    stop() {
        this.velocity.mult(0);
        this.acceleration.mult(0);
        this.updates = {};
        this.displays = {};
    }

    mouseOver() {
        return draw.mouseX >= this.position.x - this.radius &&
            draw.mouseX <= this.position.x + this.radius &&
            draw.mouseY >= this.position.y - this.radius &&
            draw.mouseY <= this.position.y + this.radius
    }

    update() {
        for (const [key, force] of Object.entries(this.updates)) {
            force();
        }
        this.position.add(this.velocity)
        this.diameter += this.growth;
    }
}