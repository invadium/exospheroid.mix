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

        // custom bind to avoid clash with the WebGL Viewport
        bind(cam) {
            this.cam = $.gcam = cam
            pin.link(cam, 'gcam')
        },

        onResize: function() {
            const EDGE = 40
            this.w = pb(32)
            this.h = pb(24)
            this.x = lab.w - this.w - EDGE
            this.y = lab.h - this.h - EDGE
        },
    } )
    const cam = glare.spawn( new dna.glare.Camera, {
        name: 'cam',
        pos:   vec3(0, 0, -40),
    })
    glare.bind(cam)

    glare.spawn( dna.glare.Form, {
        name:  'probe',
        pos:   vec3(0, 0, -100),
        rot:   vec3(0, 0, 0),
        scale: vec3(10, 10, 10),
        surface: new dna.glare.Surface({
            //mesh: lib.glib.mesh.octahedron,
            mesh: lib.glib.mesh.probe,
        }),

        init: function() {
            this.scaleDir = 1
        },

        evo: function(dt) {
            /*
            this.scale[0] += this.scaleDir * .1 * dt
            this.scale[1] += this.scaleDir * .1 * dt
            this.scale[2] += this.scaleDir * .1 * dt
            if (this.scaleDir > 0 && this.scale[0] >  1.5) this.scaleDir *= -1
            if (this.scaleDir < 0 && this.scale[0] < .15) this.scaleDir *= -1
            */
            //this.rot[0] += .5 * dt
            //this.rot[1] += .5 * dt
            this.rot[0] += -.2 * dt
            this.rot[1] +=  .5 * dt
            this.rot[2] +=  .2 * dt
            //this.pos[0] -= .1 * dt
            //this.pos[1] += .1 * dt
            //this.pos[2] -= .2 * dt
        },
    })
}
glare.Z = 201
