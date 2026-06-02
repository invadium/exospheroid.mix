function glare() {
    // setup glow rendering pipeline

    glare = lab.spawn( dna.glare.Viewport, {
        Z:     17,
        name: 'glare',

        init: function() {
            glow.initContext()
            glow.clearColor([ .1, .1, .2, 1 ])
            this.onResize()
        },

        onResize: function() {
            const EDGE = 40
            this.w = pb(32)
            this.h = pb(24)
            this.x = lab.w - this.w - EDGE
            this.y = lab.h - this.h - EDGE
        },
    } )

    glare.spawn( dna.glare.Surface, {
        mesh: lib.glib.mesh.octahedron,
    })
}
glare.Z = 201
