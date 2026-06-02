// glow state and low-level functions
const glow = {

    vp: {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
    },
    cc: [ 0, 0, 0, 0 ],

    lw: 2,

    initContext: function() {
        this.model = math.mat43()
        this.view  = math.mat43()
    },

    identity: function() {
        // TODO split MODEL/VIEW
        math.mat43.identity(this.model)
        math.mat43.identity(this.view)
    },

    rotateX(a) {
        const M = [
            1, 0, 0,
            0, cos(a), -sin(a),
            0, sin(a), cos(a),
            0, 0, 0,
        ]
        math.mat43.mul(this.model, this.model, M)
    },

    rotateY(a) {
        const M = [
            cos(a), 0, -sin(a),
            0, 1, 0,
            sin(a), 0, cos(a),
            0, 0, 0,
        ]
        math.mat43.mul(this.model, this.model, M)
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
              R  = this.vp.dx * this.lw,
              R2 = 2*R,
              M  = this.model,
              V  = this.view

        fill(.5, .5, .5)
        for (let i = 0; i < N; i += 3) {
            const v4 = [
                  w[i    ],
                  w[i + 1],
                  w[i + 2],
                  1
            ]
            math.vec4.applyMat43(v4, v4, M)
            math.vec4.applyMat43(v4, v4, V)

            v4[0] = v4[0] / v4[3]
            v4[1] = v4[1] / v4[3]

            v4[0] = v4[0] / 2
            v4[1] = v4[1] / 2

            ctx.fillRect(v4[0]-R, v4[1]-R, R2, R2)
        }
    },

    flush: function() {
        restore()
    },

}
lib.glow = glow
