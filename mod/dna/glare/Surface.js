class Surface {

    constructor(st) {
        augment(this, {
            a1: 0,
            a2: 0,
        }, st)
    }

    evo(dt) {
        this.a1 += .5 * PI * dt
        this.a2 += .25 * PI * dt
    }

    draw() {
        glow.rotateY(this.a2)
        glow.rotateX(this.a1)
        glow.draw(this.mesh.vertices)
    }

}
