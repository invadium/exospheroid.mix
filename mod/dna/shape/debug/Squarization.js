// the simplest way to draw something with WebGL
class Squarization {

    constructor(st) {
        extend(this, {
            name: 'squarization',
        }, st)
    }

    init() {
        // populate boxes
        this.boxes = []
        for (let i = 0; i < 79; i++) {
            const side = RND(20, 200)
            const color = vec4.rgba( hsl(rnd(), .5, .5) )
            this.boxes.push({
                x: RND(gl.canvas.width  - 100),
                y: RND(gl.canvas.height - 100),
                w: side,
                h: side,
                c: color,
            })
        }
    }

    background() {
        gl.clearColor(.12, .15, .21, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    box(b) {
        gl.scissor(b.x, b.y, b.w, b.h);
        gl.clearColor(...b.c)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    draw() {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        gl.disable(gl.SCISSOR_TEST);
        this.background()

        gl.enable(gl.SCISSOR_TEST);
        for (let b of this.boxes) this.box(b)
    }

}
