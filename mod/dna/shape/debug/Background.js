class Background {

    constructor(st) {
        extend(this, {
            Z:     0,
            name:  'background',
            color: vec4.rgb('#1C1F22'),
        }, st)
    }

    draw() {
        lib.glut.useProgram(lib.glsl.zprog.zap)

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearColor(...this.color)
        gl.disable(gl.CULL_FACE)
        gl.disable(gl.SCISSOR_TEST);
        gl.clearDepth(1.0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }

}
