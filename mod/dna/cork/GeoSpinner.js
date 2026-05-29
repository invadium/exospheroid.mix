class GeoSpinner {

    constructor(st) {
        augment(this, {
            name: 'geoSpinner',
            pos:   vec3(),
            angle: 0,
            r:     12, // maybe dynamic derived from the geo meshes sizes values?

            target:          0,
            spin:            1,
            spinSpeed:      .4*PI,
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
        this.geoForm()
        this.targetLast()
    }

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

        this.placeInCircle()
        this.justifyForms()
    }

    geoShape(g) {
        console.dir(g)
        return lab.port.attach( new dna.shape.Form({
            name:        g.name,
            pos:         vec3(),
            rot:         vec3(),
            rotSpeed:    vec3(-.1, .5, 0),
            angle:       0,
            targetAngle: 0,
            spin:        1,
            // stats:       this.shapeStats,

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

    placeInCircle() {
        const _ = this
        const sector = _.sector = PI2 / (_.shapes.length)
        _.shapes.forEach((shape, id) => {
            const ta = math.normalizeAngle(-id*sector)
            shape.angle = ta
            shape.setTargetAngle(ta)
        })
    }

    justifyForms() {
        const _ = this
        const sector = _.sector = PI2 / (_.shapes.length)
        this.shapes.forEach((shape, id) => {
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
        this.justifyForms()
        this.evoShapes(dt)
        this.evoSpin(dt)
        this.evoTransition(dt)

        const active = this.getTargetShape()
        if (active) {
            env.status = `Shape: ${this.shapes[this.target].geo.name}`
        }
    }

    targetAngle() {
        const sector = this.sector = PI2 / (this.shapes.length)
        return math.normalizeAngle(this.target*sector - PI/2)
    }

    targetFirst() {
        this.target = 0
        this.syncCamera()
    }

    targetNext() {
        this.spin = 1
        this.target ++
        if (this.target >= this.shapes.length) this.target = 0
        this.syncCamera()
        log('target: ' + this.target)
    }

    targetPrev() {
        this.spin = -1
        this.target --
        if (this.target < 0) this.target = this.shapes.length - 1
        this.syncCamera()
        log('target: ' + this.target)
    }

    targetLast() {
        this.target = this.shapes.length - 1
        this.syncCamera()
        log('target last: ' + this.target)
    }

    getTargetShape() {
        return this.shapes[this.target]
    }

    syncCamera() {
        pin.cam.lookAt([0, 0, -12])
    }
}
