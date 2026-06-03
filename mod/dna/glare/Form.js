class Form {

    constructor(st) {
        augment(this, {
            pos:   vec3(),
            rot:   vec3(),
            scale: vec3(),
        }, st)
    }

    draw() {
        glow.pushMatrix()

        glow.translate( this.pos )
        glow.rot( this.rot )
        glow.scale( this.scale )

        this.surface.draw()

        glow.popMatrix()
    }

}
