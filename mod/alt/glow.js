// glow state and low-level functions
const glow = {

    vp: {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
    },
    cc: [ 0, 0, 0, 0 ],
    lw: 1,

    model: null,
    view:  null,
    MV:    null,

    mstack: [],
    istack: 0,

    initContext: function() {
        this.model = math.mat43()
        this.view  = math.mat43()
        this.MV    = math.mat43() // model-view buffer
        this.mat   = this.model
    },

    useModel: function() {
        this.mat = this.model
    },

    useView: function() {
        this.mat = this.view
    },

    identity: function() {
        math.mat43.identity(this.mat)
    },

    pushMatrix: function() {
        let BM = this.mstack[ this.istack ]
        if (!BM) {
            this.mstack[ this.istack ] = BM = math.mat43()
        }
        math.mat43.copy(BM, this.mat)
        this.istack ++
    },

    popMatrix: function() {
        if (this.istack === 0) throw new Error("can't pop the matrix - the stack is empty!")

        this.istack --
        math.mat43.copy(this.mat, this.mstack[ this.istack ])
    },

    scale(v3) {
        const M = [
            v3[0], 0,     0,
            0,     v3[1], 0,
            0,     0,     v3[2],
            0,     0,     0,
        ]
        math.mat43.mul(this.mat, this.mat, M)
    },

    rotateX(a) {
        const M = [
            1, 0,       0,
            0, cos(a), -sin(a),
            0, sin(a),  cos(a),
            0, 0,       0,
        ]
        math.mat43.mul(this.mat, this.mat, M)
    },

    rotateY(a) {
        const M = [
            cos(a), 0, -sin(a),
            0,      1,  0,
            sin(a), 0,  cos(a),
            0,      0,  0,
        ]
        math.mat43.mul(this.mat, this.mat, M)
    },

    rotateZ(a) {
        const M = [
            cos(a), -sin(a), 0,
            sin(a),  cos(a), 0,
            0,       0,      1,
            0,       0,      0,
        ]
        math.mat43.mul(this.mat, this.mat, M)
    },

    translate(v3) {
        const M = [
            1,     0,     0,
            0,     1,     0,
            0,     0,     1,
            v3[0], v3[1], v3[2],
        ]
        math.mat43.mul(this.mat, this.mat, M)
    },

    viewport(x, y, w, h) {
        const vp = this.vp
        vp.x  = x
        vp.y  = y
        vp.w  = w
        vp.h  = h
        vp.hw = .5 * w
        vp.hh = .5 * h
        vp.dx =  2 / w
        vp.dy =  2 / h
        vp.xscale  = .5 * w
        vp.yscale  = .5 * h
        vp.aspect  = w / h
        vp.vaspect = h / w

        save()
        translate(x + .5*w, y + .5*h)
        scale( vp.xscale, -vp.yscale )
    },

    perspective(vfov, aspect, zNear, zFar) {
        math.mat43.perspective(this.mat, vfov, aspect, zNear, zFar)
    },

    clearColor: function(c4) {
        this.cc = c4
    },

    clear: function() {
        fill( rgba(this.cc) )
        rect( -1, -1, 2, 2 )

        // test normalized triangle
        lineWidth(this.vp.dx * this.lw)
        stroke(.5, .5, .5)
        line( -.5, -.5,   0,  .5 )
        line(   0,  .5,  .5, -.5 )
        line(  .5, -.5, -.5, -.5 )
    },

    draw: function(w) {
        // TODO do model and view translation
        // TODO do primitive assembly if faces are provided

        // render points
        const N  = w.length,
              R  = 2 * this.vp.dx * this.lw,
              R2 = 2*R,
              M  = this.model,
              V  = this.view,
              MV = this.MV
        if (this.debug) debugger

        math.mat43.copy(MV, M)
        // math.mat43.mul(MV, MV, V)

        fill(.5, .5, .5)
        lineWidth(this.vp.dx * this.lw)
        let fv, pv 
        for (let i = 0; i < N; i += 9) {
            const v1 = [ w[i    ], w[i + 1], w[i + 2], 1 ],
                  v2 = [ w[i + 3], w[i + 4], w[i + 5], 1 ],
                  v3 = [ w[i + 6], w[i + 7], w[i + 8], 1 ]

            math.vec4.applyMat43(v1, v1, MV)
            v1[0] = (v1[0] / v1[3]) / v1[2]
            v1[1] = (v1[1] / v1[3]) / v1[2]
            math.vec4.applyMat43(v2, v2, MV)
            v2[0] = (v2[0] / v2[3]) / v2[2]
            v2[1] = (v2[1] / v2[3]) / v2[2]
            math.vec4.applyMat43(v3, v3, MV)
            v3[0] = (v3[0] / v3[3]) / v3[2]
            v3[1] = (v3[1] / v3[3]) / v3[2]
            /*
            // transform vertices
            math.vec4.applyMat43(v1, v1, MV)
            v1[0] = v1[0] / (v1[3] - v1[2])
            v1[1] = v1[1] / (v1[3] - v1[2])
            v1[2] = v1[2] / (v1[3] - v1[2])
            math.vec4.applyMat43(v2, v2, MV)
            v2[0] = v2[0] / (v2[3] - v2[2])
            v2[1] = v2[1] / (v2[3] - v2[2])
            v2[2] = v2[2] / (v2[3] - v2[2])
            math.vec4.applyMat43(v3, v3, MV)
            v3[0] = v3[0] / (v3[3] - v3[2])
            v3[1] = v3[1] / (v3[3] - v3[2])
            v3[2] = v3[2] / (v3[3] - v3[2])
            */

            if (v1[2] < 0 && v2[2] < 0 && v3[2] < 0) {
                /*
                ctx.fillRect(v1[0]-R, v1[1]-R, R2, R2)
                ctx.fillRect(v2[0]-R, v2[1]-R, R2, R2)
                ctx.fillRect(v3[0]-R, v3[1]-R, R2, R2)
                */
                stroke(.25, .5, .5)
                line(v1[0], v1[1], v2[0], v2[1])
                line(v2[0], v2[1], v3[0], v3[1])
                line(v3[0], v3[1], v1[0], v1[1])
            }
        }
    },

    flush: function() {
        restore()
    },

}
lib.glow = glow
