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
        glow.rotateX( this.rot[0] )
        glow.rotateY( this.rot[1] )
        glow.rotateZ( this.rot[2] )
        glow.scale( this.scale )

        this.surface.draw()

        glow.popMatrix()
    }

}
