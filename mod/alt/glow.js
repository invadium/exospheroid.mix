// glow state and low-level functions
const glow = {

    vp: {
        x: 0,
        y: 0,
        w: 1,
        h: 1,
    },
    cc: [ 0, 0, 0, 0 ],

    initContext: function() {
        this.model = math.mat43()
        this.view  = math.mat43()
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
        lineWidth(this.vp.dx)
        stroke(.5, .5, .5)
        line( -.5, -.5,   0,  .5 )
        line(   0,  .5,  .5, -.5 )
        line(  .5, -.5, -.5, -.5 )
    },

    flush: function() {
        restore()
    },

}
lib.glow = glow
