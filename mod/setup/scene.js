function scene() {
    
    const cam = lab.port.spawn( dna.Camera, {
        Z:     13,
        name: 'cam',
        _pods: [
            new dna.pod.FreeMovementControllerPod({
                name: 'freeMovementController',
            }),
            new dna.pod.OrbitalControllerPod({
                name: 'orbitalController',
            }),
        ],
    })
    lab.port.bindCamera(cam)

    /*
    // spawn a running away geometry
    const plane = lab.port.spawn(dna.geo.debug.Plane, {
        Z:         101,
        size:      1,
        pos:       vec3(0, 0, 0),
        speed:     .5,
        rot:       vec3.izero(),
        rSpeed:    vec3(.2 * PI, .3 * PI, .1 * PI),
        //rSpeed:    vec3.izero(),

        evo: function(dt) {
            const { rot, rSpeed } = this
            rot[0] += rSpeed[0] * dt
            rot[1] += rSpeed[1] * dt
            rot[2] += rSpeed[2] * dt
            this.pos[2] -= this.speed * dt
            this.orig().scale(this.size).rotX(rot[0]).rotY(rot[1]).rotZ(rot[2]).translateV3(this.pos).bindBuffer()

            pin.info.set('Plane Pos', lib.dump.vec3(this.pos, 2))
        },
    })
    plane.evo(0.01)
    */

    /*
    lab.port.attach( new dna.geo.Surface({
        name: 'cube',
        geo: lib.geo.glib.cube,
        m: {
            a: vec4( 0,  0,  1, 1),
            d: vec4(.1, .8, .9, 0),
            s: vec4(1, 1, 1, 0),
            i: vec4(.2, .5, .8, 0),
            n: 50,
        },
    }))
    */

    const cuboid = lab.port.attach( new dna.geo.Form({
        name: 'cuboid',
        pos: vec3(0, 0, 0),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(0, 0, 0),
        scale: vec3(1.5, 1.5, 1.5),

        _pods: [
            {
                name: 'rotator',
                evo: function(dt) {
                    const __ = this.__
                    __.rot[0] += __.rotSpeed[0] * dt
                    __.rot[1] += __.rotSpeed[1] * dt
                    __.rot[2] += __.rotSpeed[2] * dt
                },
            },
            {
                name: 'mover',
                evo: function(dt) {
                    const __ = this.__
                    __.pos[1] += .25 * dt
                    //__.pos[1] += 2 * dt
                },
            },
            new dna.geo.Surface({
                name: 'cube',
                // geo: lib.geo.glib.cube,
                // geo: lib.geo.glib['mod-octahedron'],
                geo: lib.geo.glib['octahedron'],
                m: {
                    a: vec4( 0,  0,  1, 1),
                    d: vec4(.1, .8, .9, 0),
                    s: vec4(1, 1, 1, 0),
                    i: vec4(.2, .5, .8, 0),
                    n: 50,
                },
            }),
        ],

        init() {
            this.rotSpeed[0] = .5
            this.rotSpeed[1] = .3
            this.rotSpeed[2] = .2
        },
    }))

    /*
    lab.spawn(dna.geo.Image, {
        Z: 101,
        glProg: lib.glsl.zprog.basic,

        fixTexture: function() {
            return res.texture.compass.glRef
        },
    })
    */

    //lab.spawn(dna.geo.debug.Squarization)
    //lab.spawn(dna.geo.debug.Background)

    /*
    lab.spawn(dna.geo.debug.Plane, {
        Z:         101,
        rot:       vec3.izero(),
        rSpeed:    vec3(.2 * PI, .3 * PI, .1 * PI),

        evo: function(dt) {
            const { rot, rSpeed } = this
            rot[0] += rSpeed[0] * dt
            rot[1] += rSpeed[1] * dt
            rot[2] += rSpeed[2] * dt
            const s = .25
            this.orig().scale(s).rotX(rot[0]).rotY(rot[1]).rotZ(rot[2]).bindBuffer()
        }
    })
    */

    /*
    lab.spawn(dna.geo.debug.PointSprite, {
        Z:   102,
        pos: vec3(0, 0, 0),

        postInit: function() {
            this.orig().translate(.5, 0, 0).bindBuffer()
        },

        evo: function(dt) {
            const p = this.pos
            p[0] += 0.2 * dt
            p[1] += 0.1 * dt
            p[2] += 0.5 * dt
            this.orig().translate(p[0], p[1], p[2]).bindBuffer()
        },
    })
    */

    /*
    lab.spawn(dna.geo.Image, {
        Z: 102,
        glProg: lib.glsl.zprog.basic,

        fixTexture: function() {
            return res.texture.compass.glRef
        },
    })
    */

    // move camera back a little
    cam.pos[1] = 4
    cam.pos[2] = 16
    cam.dir[1] = .2

    lab.port.cam.lookAt(cuboid)
}
scene.Z = 101
