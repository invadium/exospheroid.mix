const EntityFrame = require('dna/EntityFrame')

// a transformation node ewith position, rotation and scale
class Form extends EntityFrame {

    constructor(st) {
        super( extend({
            pos:   vec3.izero(),
            rot:   vec3.izero(),
            scale: vec3(1, 1, 1),
        }, st))
        
    }

    draw() {
        glu.pushMatrix()
        glu.translate(this.pos).rot(this.rot).scale(this.scale)

        // since we modified the world position, we MUST update the model matrix uniform
        glu.applyModelMatrix()
        super.draw()

        glu.popMatrix()
        glu.applyModelMatrix()
    }
}
