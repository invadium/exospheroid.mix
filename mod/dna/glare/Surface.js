class Surface {

    constructor(st) {
        augment(this, {
            a1: 0,
            a2: 0,
        }, st)
    }

    draw() {
        glow.draw(this.mesh.vertices)
    }

}
