class Forces {
    constructor() {
        this.types = [{
                name: 'Align',
                key: 'align',
                description: 'Circle adjusts heading to those around it.'
            },
            {
                name: 'Border Bounce',
                key: 'borderBounce',
                description: 'Circle bounces off the edges of the screen.'
            },
            {
                name: 'Cohesion',
                key: 'cohesion',
                description: 'Circles drift towards other nearby circles.'
            },
            {
                name: 'Collide Bounce',
                key: 'collideBounce',
                description: 'Circles bounce off each other.'
            },
            {
                name: 'Eyes',
                key: 'eyes',
                description: "You'll have to 'see' for yourself. Tee hee."
            },
            {
                name: 'Float',
                key: 'float',
                description: 'Circles will float to the top of the screen.'
            },
            {
                name: 'Gravity',
                key: 'gravity',
                description: 'Circles will fall to the bottom of the screen (and beyond).'
            },
            {
                name: 'Multiply',
                key: 'multiply',
                description: 'Circles will spawn smaller, darker versions of themselves.'
            },
            {
                name: 'Separate',
                key: 'separate',
                description: 'Circles will separate from each other.'
            },
            {
                name: 'Seek Mouse',
                key: 'seek',
                description: 'Circles are drawn towards the cursor.'
            },
            {
                name: 'Tickle',
                key: 'tickle',
                description: 'Tee hee hee.'
            },
            {
                name: 'Wrap',
                key: 'wrap',
                description: 'Circles will wrap around the screen'
            }

        ]
    }
    align() {
        let neighbordist = 50;
        let sum = draw.createVector(0, 0);
        let count = 0;
        for (let i = 0; i < system.circles.length; i++) {
            let d = p5.Vector.dist(this.position, system.circles[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(system.circles[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count).normalize().mult(system.maxspeed);
            let steer = p5.Vector.sub(sum, this.velocity).limit(system.maxforce);
            this.velocity.add(steer.mult(1.5));
        }
    }
    borderBounce({
        width = draw.width,
        floor = window.innerHeight,
        ceiling = 0
    }) {
        floor -= $('.controls').height()
        if (this.position.x + this.radius > width) {
            this.position.x = draw.width - this.radius;
            this.velocity.x *= system.friction;
        } else if (this.position.x - this.radius < 0) {
            this.position.x = this.radius;
            this.velocity.x *= system.friction;
        }
        if (this.position.y + this.radius > floor) {
            this.position.y = floor - this.radius;
            this.velocity.y *= system.friction;
        } else if (this.position.y - this.radius < ceiling) {
            this.position.y = ceiling + this.radius;
            this.velocity.y *= system.friction;
        }
    }
    cohesion(config) {
        let neighbordist = 100;
        let target = draw.createVector(0, 0); // Start with empty vector to accumulate all locations
        let count = 0;
        for (let i = 0; i < system.circles.length; i++) {
            let d = p5.Vector.dist(this.position, system.circles[i].position);
            if ((d > 0) && (d < neighbordist)) {
                target.add(system.circles[i].position); // Add location
                count++;
            }
        }
        if (count > 0) {
            target.div(count);
            config.target = target;
            this.seek.call(this, target); // Steer towards the location
        }
    }
    collide() {
        system.mouse.position = draw.createVector(draw.mouseX, draw.mouseY)
        let handle = system.forces.handleCollide.bind(this)
        system.circles.forEach((c) => {
            handle(c, true, this)
        })
    }
    eyes() {
        let angle = draw.atan2(draw.mouseY - this.position.y, draw.mouseX - this.position.x);
        draw.push();
        draw.translate(this.position.x, this.position.y);
        draw.fill(255);
        draw.ellipse(0, 0, this.diameter, this.diameter);
        draw.rotate(angle);
        draw.fill(153, 204, 0);
        draw.ellipse(this.diameter / 4, 0, this.diameter / 2, this.diameter / 2);
        draw.pop();
    }
    float() {
        let mass = this.diameter / 100 * 0.05;
        let buoyancy = draw.createVector(0, -mass)
        this.velocity.add(buoyancy)
    }
    gravity() {
        let mass = this.diameter / 100 * 0.1;
        let gravity = draw.createVector(0, mass);
        this.velocity.add(gravity);
    }
    handleCollide(c) {
        let toOther = p5.Vector.sub(c.position, this.position)
        let distance = p5.Vector.dist(c.position, this.position)
        let minDist = c.diameter / 2 + this.diameter / 2;
        if (distance < minDist) {
            let angle = draw.atan2(toOther.y, toOther.x);
            let target = draw.createVector(draw.cos(angle), draw.sin(angle)).mult(minDist).add(this.position)
            let force = p5.Vector.sub(target, c.position).mult(system.spring)
            this.velocity.sub(force);
            c.velocity.add(force)
        }
    }
    multiply() {
        if(this.mouseOver() && system.canMultiply){
            console.log(system.circles.length)
            system.canMultiply = false;
            setTimeout(()=>{system.canMultiply = true},200)
            if (system.circles.length < 70) {
                let xRange = draw.random(this.position.x - this.radius, this.position.x + this.radius)
                let yRange = draw.random(this.position.y - this.radius, this.position.y + this.radius)
                let newDiam = Math.max(this.diameter * .8, 20)
                let newColor = Math.floor(this.color * .9)
                let circ = new Circle(xRange, yRange, newDiam, newColor);            
                system.circles.unshift(circ);
                if (this.diameter > 20) {
                    this.diameter *= .8
                };                
                system.updateForces()
            } else {
                $('.multiply').removeClass('btn-success').addClass('btn-secondary')
                $('.multiply').attr('disabled',true )
            }
        }
    }
    seek({
            target = draw.createVector(draw.mouseX, draw.mouseY)
        }

    ) {        
        let desired = p5.Vector.sub(target, this.position).normalize().mult(system.maxspeed);
        let steer = p5.Vector.sub(desired, this.velocity).limit(system.maxforce).mult(system.seekStrength); // Limit to maximum steering force        
        this.velocity.add(steer)
    }

    separate() {
        let desiredSeparation = this.diameter * 1.5;
        let steer = draw.createVector(0, 0);
        let count = 0;        
        for (let i = 0; i < system.circles.length; i++) {
            let d = p5.Vector.dist(this.position, system.circles[i].position);            
            if ((d > 0) && (d < desiredSeparation)) {                
                let diff = p5.Vector.sub(this.position, system.circles[i].position);
                diff.normalize().div(d); 
                steer.add(diff);
                count++; 
            }
        }        
        if (count > 0) {
            steer.div(count);
        }        
        if (steer.mag() > 0) {            
            steer.normalize().mult(system.maxspeed).sub(this.velocity).limit(system.maxforce);
        }
        steer.mult(1.5);
        this.velocity.add(steer)
    }
    tickle() {
        if (this.mouseOver()) {
            let distance = this.radius/4;
            this.position.x += draw.random(-distance, distance);
            this.position.y += draw.random(-distance, distance);
            this.timer++
        }
    }
    wrap() {
        if (this.position.x < -this.diameter) this.position.x = draw.width + this.diameter;
        if (this.position.y < -this.diameter) this.position.y = draw.height + this.diameter;
        if (this.position.x > draw.width + this.diameter) this.position.x = -this.diameter;
        if (this.position.y > window.innerHeight + this.diameter) this.position.y = -this.diameter;
    }
}



