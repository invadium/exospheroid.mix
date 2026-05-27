// Legacy core UI component of Corkscrew
// TODO move out to dna/screw
class GeoSpinnerLegacy {

    constructor(st) {
        extend(this, {
            pos:   vec3(),
            angle: 0,
            r:     12, // maybe dynamic derived from the geo meshes sizes values?

            target:      0,
            spin:        1,
            spinSpeed:   .4*PI,
            transitionSpeed: 1,

            shapeStats: {
                spinSpeed: PI,
                scaleSpeed: .1,
                minScale: 0.2,
                maxScale: 32,
            }
        }, st)
    }

    init() {
        this.anchor = vec3.clone(this.pos)
        // if (this.gindex) this.buildLib()
        // else if (this.glib) this.buildIndex()
        this.geoForm()
        // this.targetLast()
    }

    /*
    buildIndex() {
        const glib = this.glib
        const gindex = this.gindex = []
        // index glib
        for (let name in glib) {
            log('indexing: ' + name)
            gindex.push(glib[name])
        }
        log('shapes found in geo: ' + gindex.length)
    }

    buildLib() {
        const gindex = this.gindex
        const glib = this.glib = {}

        let i = 0
        gindex.forEach(g => {
            if (g.name) glib[g.name] = g
            log('registering glib entry: ' + g.name)
            i++
        })
        log('shapes registered in glib: ' + i)
    }
    */

    geoForm() {
        const _ = this
        const shapes = this.shapes = []

        this.geoLibrary.mesh._ls.forEach((g) => {
            const shape = _.geoShape(g)
            shape.geo = g
            g.shape = shape
            shapes.push(shape)
        })
        console.dir(shapes)

        // this.place()
        // this.adjust()
    }

    /*
    const cuboid = lab.port.attach( new dna.shape.Form({
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
            new dna.shape.Surface({
                name: 'cube',
                // geo: lib.geo.glib.cube,
                // geo: lib.geo.glib['mod-octahedron'],
                // geo: lib.geo.glib['octahedron'],
                geo: lib.geoLibrary.mesh.selectOne('octahedron'),
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
            this.rotSpeed[0] =  0
            this.rotSpeed[1] = .3
            this.rotSpeed[2] =  0
        },
    }))
    */

    geoShape(g) {
        console.dir(g)
        return lab.attach( new dna.shape.Form({
            angle:       0,
            targetAngle: 0,
            spin:        1,
            stats:       this.shapeStats,

            _pods: [
                new dna.shape.Surface({
                    geo: g,
                    // TODO should come from material library
                    m: {
                        a: vec4(.5, .6, .7, .2),
                        d: vec4(.2, .8, .7, .7),
                        s: vec4(1, 1, 1, .5),
                        n: 21,
                    },
                }),
            ],

            rotSpeed: vec3(-.1, .5, 0),

            setTargetAngle: function(ta) {
                this.targetAngle = ta
                /*
                // getermine the shortest spin ???
                const da = ta - this.angle
                const rd = da > 0? da : da + PI2
                const ld = da < 0? abs(da) : this.angle + PI2-ta

                if (rd < .5 || ld < .4) return
                if (rd < ld) this.spin = -1
                else this.spin = 1
                */
            },

            evoToTargetAngle: function(dt) {
                const ta = this.targetAngle
                if (this.angle === ta) return

                // adjust to the target angle
                const _angle = this.angle
                this.angle = math.normalizeAngle(this.angle + this.spin * this.stats.spinSpeed * dt)

                // fit the target
                if (this.spin > 0) {
                    if (_angle <= ta && this.angle >= ta) this.angle = ta
                } else {
                    if (_angle >= ta && this.angle <= ta) this.angle = ta
                }
            },

            evo: function(dt) {
                // rotate the shape
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[2] * dt 

                this.evoToTargetAngle(dt)
            },
        }))
    }

    place() {
        const $ = this
        const sector = $.sector = PI2 / ($.shapes.length)
        this.shapes.forEach(shape => {
            const id = $.shapes.indexOf(shape)
            const ta = math.normalizeAngle(-id*sector)
            shape.angle = ta
            shape.setTargetAngle(ta)
        })
    }

    adjust() {
        const $ = this
        const sector = $.sector = PI2 / ($.shapes.length)
        this.shapes.forEach(shape => {
            const id = $.shapes.indexOf(shape)
            shape.setTargetAngle( math.normalizeAngle(-id*sector) )
        })

        if (this.anchor && !vec3.equals(this.pos, this.anchor)) {
            if (!this.inTransit) {
                this.inTransit = true
                this.transitRate = 0
                this._pos = vec3.clone(this.pos)
            }
        }
    }

    targetAngle() {
        const sector = this.sector = PI2 / (this.shapes.length)
        return math.normalizeAngle(this.target*sector - PI/2)
    }

    targetNext() {
        this.spin = 1
        this.target ++
        if (this.target >= this.shapes.length) this.target = 0
    }

    targetPrev() {
        this.spin = -1
        this.target --
        if (this.target < 0) this.target = this.shapes.length - 1
    }

    targetLast() {
        this.target = this.shapes.length - 1
    }

    wireframes(f) {
        const w = f? 1 : 0
        this.shapes.forEach(shape => {
            shape.surface.rO[1] = w
        })
    }

    shading(f) {
        const s = f? 1 : 0
        this.shapes.forEach(shape => {
            shape.surface.rO[0] = s
        })
    }

    scale(s) {
        const activeShape = this.getActiveShape()
        if (!activeShape) return

        const sv = activeShape.scale,
            min = this.shapeStats.minScale,
            max = this.shapeStats.maxScale,
            speed = this.shapeStats.scaleSpeed
        s *= speed

        sv[0] = clamp(sv[0] + s, min, max)
        sv[1] = clamp(sv[1] + s, min, max)
        sv[2] = clamp(sv[2] + s, min, max)

        env.dump.NewScale = '' + sv[0]
    }

    rotateX(dv) {
    }

    rotateY(dv) {
    }

    evoShapes(dt) {
        const $ = this
        this.shapes.forEach(shape => {
            const ra = shape.angle + $.angle
            const dx = cos(ra) * $.r
            const dy = 0
            const dz = sin(ra) * $.r
            vec3.set(shape.pos, dx, dy, dz)
            vec3.add(shape.pos, shape.pos, $.pos)
        })
    }

    evoSpin(dt) {
        // turn the geo spinner to target
        const ta = this.targetAngle()
        env.dump['Target Angle'] = Math.round(ta * RAD_TO_DEG) + ' - ' + Math.round(ta * 100)/100
        if (this.angle === ta) return

        const _angle = this.angle
        this.angle = math.normalizeAngle(this.angle + this.spin * this.spinSpeed * dt)

        // fit the target
        if (this.spin > 0) {
            if (_angle <= ta && this.angle >= ta) this.angle = ta
        } else {
            if (_angle >= ta && this.angle <= ta) this.angle = ta
        }
    }

    evoTransition(dt) {
        if (!this.inTransit) return // nothing to transit
        this.transitRate += this.transitionSpeed * dt
        if (this.transitRate >= 1) {
            // the transit is over
            vec3.copy(this.pos, this.anchor)
            this.transitRate = 0
            this.inTransit = false 
        } else {
            this.pos[0] = this._pos[0] + (this.anchor[0] - this._pos[0]) * this.transitRate
            this.pos[1] = this._pos[1] + (this.anchor[1] - this._pos[1]) * this.transitRate
            this.pos[2] = this._pos[2] + (this.anchor[2] - this._pos[2]) * this.transitRate
        }
    }

    evo(dt) {
        this.adjust()
        this.evoShapes(dt)
        this.evoSpin(dt)
        this.evoTransition(dt)

        const active = this.getActiveShape()
        if (active) {
            env.status = `Shape: ${this.shapes[this.target].geo.name}`
        }
    }

    getActiveShape() {
        return this.shapes[this.target]
    }

    getScript() {
        return this.gindex.screw || 'Not Available'
    }
}
