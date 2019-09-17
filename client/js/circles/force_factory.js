class ForceFactory {
    constructor() {

    }
    apply(circle, type, config) {
        if (type.indexOf('align') !== -1) {
            circle.updates['align'] = system.forces.align.bind(this,config);
        } else {
            delete circle.updates['align']
        }

        if (type.indexOf('borderBounce') !== -1) {
            circle.updates['borderBounce'] = system.forces.borderBounce.bind(this,config);
        } else {
            delete circle.updates['borderBounce']
        }

        if (type.indexOf('cohesion') !== -1) {
            circle.seek = system.forces.seek.bind(this,config);
            circle.updates['cohesion'] = system.forces.cohesion.bind(this,config);
        } else {
            if (type.indexOf('seek') === -1) {
                delete circle.updates['seek']
            }
            delete circle.updates['cohesion']
        }

        if (type.indexOf('collideBounce') !== -1) {
            circle.updates['collideBounce'] = system.forces.collide.bind(this,config);
        } else {
            delete circle.updates['collideBounce']
        }

        if (type.indexOf('float') !== -1) {
            circle.updates['float'] = system.forces.float.bind(this,config);
        } else {
            delete circle.updates['float']
        }

        if (type.indexOf('gravity') !== -1) {
            circle.updates['gravity'] = system.forces.gravity.bind(this,config);
        } else {
            delete circle.updates['gravity']
        }

        if (type.indexOf('eyes') !== -1) {            
            circle.displays['eyes'] = system.forces.eyes.bind(this,config);
        } else {
            delete circle.displays['eyes']
        }

        if (type.indexOf('multiply') !== -1) {
            circle.updates['multiply'] = system.forces.multiply.bind(this,config);
        } else {
            delete circle.updates['multiply']
        }

        if (type.indexOf('seek') !== -1) {
            circle.updates['seek'] = system.forces.seek.bind(this,config);
        } else {
            delete circle.updates['seek']
        }

        if (type.indexOf('separate') !== -1) {
            circle.updates['separate'] = system.forces.separate.bind(this,config);
        } else {
            delete circle.updates['separate']
        }

        if (type.indexOf('tickle') !== -1) {
            circle.updates['tickle'] = system.forces.tickle.bind(this,config);
        } else {
            delete circle.updates['tickle']
        }

        if (type.indexOf('wrap') !== -1) {
            circle.updates['wrap'] = system.forces.wrap.bind(this,config);
        } else {
            delete circle.updates['wrap']
        }
        return circle;
    }
}