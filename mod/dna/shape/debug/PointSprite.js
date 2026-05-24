
let id = 0

class PointSprite extends dna.EntityFrame {

    constructor(st) {
        if (!st._traits) st._traits = []
        st._traits = augment(st._traits, [ dna.geo.debug.trait.verticeTransformUtilsTrait ])

        super( extend({
            name: 'pointSprite' + (++id),
            color: vec3(1, 0, 1),
        }, st) )
    }

    init() {
        // select the buffer to apply operations to
        this.origVertices = new Float32Array([
             0,  0,  0,
        ])
        this.orig()
        this.colors = new Float32Array(this.color)

        this.posBufRef = gl.createBuffer()
        this.bindBuffer()

        const [minSize, maxSize] = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)
        this.colorBufRef = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufRef)
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        if (this.postInit) this.postInit()
    }

    bindBuffer() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBufRef)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        return this
    }

    draw() {
        lib.glut.useProgram(lib.glsl.zprog.zap)

        // setup the rendering pipeline
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBufRef)
        gl.vertexAttribPointer( gl.getAttribLocation(glu.glProg, 'aVertPos'), 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray( gl.getAttribLocation(glu.glProg, 'aVertPos') )

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBufRef)
        gl.vertexAttribPointer( gl.getAttribLocation(glu.glProg, 'aVertColor'), 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray( gl.getAttribLocation(glu.glProg, 'aVertColor') )

        gl.drawArrays(gl.POINTS, 0, this.vertices.length / 3)
    }
}
