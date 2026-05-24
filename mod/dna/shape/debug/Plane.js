
let id = 0


class Plane extends dna.EntityFrame {

    constructor(st) {
        if (!st._traits) st._traits = []
        st._traits = augment(st._traits, [ dna.geo.debug.trait.verticeTransformUtilsTrait ])

        super( extend({
            name: 'plane' + (++id),
            renderOpt: vec4(0, 0, 0, 1), // render options
            scale: 4,
        }, st) )
    }

    init() {
        // select the buffer to apply operations to
        this.origVertices = new Float32Array([
            // left triangle
            -1,  1,  0,
            -1, -1,  0,
             1,  1,  0,

            // right triangle
             1,  1,  0,
            -1, -1,  0,
             1, -1,  0,
        ])
        this.orig()

        this.colors = new Float32Array([
            1, 0, 0,
            0, 0, 1,
            0, 1, 0,

            0, 1, 1,
            1, 0, 1,
            1, 1, 0,
        ])

        this.posBufRef = gl.createBuffer()
        this.bindBuffer()

        this.colorBufRef = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufRef)
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.DYNAMIC_DRAW);
    }

    bindBuffer() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBufRef)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        return this
    }

    preDraw() {
        const uniform   = glu.uniform,
              attribute = glu.attribute

        //lib.glut.useProgram(lib.glsl.zprog.zap)
        //glu.withProgram(lib.glsl.zprog.flat)
        glu.withProgram(lib.glsl.zprog.plainColor)

        // we're missing MVP at this point!!!
        //lab.port.applyMVP()

        //gl.uniform4fv(uniform.uOpt, this.renderOpt)
        //glu.uniform4fv('uOpt', this.renderOpt)

        glu.uniform4fv('uColor', vec4(0, .4, .7, 0))
        glu.uniform1f('testo', 10.1)

        // setup the rendering pipeline
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        // TODO map buffers automatically if there is a standard name
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBufRef)
        gl.vertexAttribPointer( gl.getAttribLocation(glu.glProg, 'aVertPos'), 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray( gl.getAttribLocation(glu.glProg, 'aVertPos') )

        /*
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufRef)
        gl.vertexAttribPointer( gl.getAttribLocation(glu.glProg, 'aVertColor'), 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray( gl.getAttribLocation(glu.glProg, 'aVertColor') )
        */
    }

    postDraw() {
        glu.prevProgram()
    }

    draw() {
        this.preDraw()
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3)
        this.postDraw()
    }

}
