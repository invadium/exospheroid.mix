const
    FLY_UP      = 10,
    FLY_DOWN    = 11,
    ROLL_LEFT   = 12,
    ROLL_RIGHT  = 13

class OrbitalControllerPod {

    constructor(st) {
        extend(this, {
            name:            'orbitalController',
            alias:           'controller',

            speed:            20,
            zoomSpeed:        80,
            minFOV:           1,
            maxFOV:           120,
            r:                10,
            maxDist:          3,
            verticalTurnSpeed:   PI,
            horizontalTurnSpeed: 20 * PI,

            mouseCaptureMask: 2,
            moveOnClick:      true,
            mouseMoveMask:    4,

            sensitivity: {
                horizontal:   .02,
                vertical:     .02,
                wheel:        .0001,
            },

            reversePitch:     false,
            reverseYaw:       false,
        }, st)
        trait(this, dna.trait.activePodTrait)
        this.pushers = new Float32Array(32)
    }

    init() {
        this.activate()
        this.capture()
    }

    capture() {
        lab.monitor.mouseBroker = this
        lab.monitor.controller.bindAll(this)
    }

    release() {
        if (lab.monitor.mouseBroker === this) {
            lab.monitor.mouseBroker = null
            lab.monitor.controller.releaseAll(this)
        }
    }

    onActivate() {
        this.capture()
    }

    onDeactivate() {
        this.release()
    }

    zoom(dtFactor) {
        const __    = this.__,
              delta = dtFactor * this.zoomSpeed
        __.vfov = clamp(__.vfov + delta, this.minFOV, this.maxFOV)
    }

    /*
    init() {
        // register additional actions
        env.bind.push('KeyE')     // fly up
        env.bind.push('KeyC')     // fly down
        env.bind.push('Delete')   // roll left
        env.bind.push('PageDown') // roll right
        this.capture()
    }
    */

    push(action, factor, dt) {
        const __ = this.__,
              speed     = this.speed,
              turnSpeed = this.turnSpeed

        switch(action) {
            case dry.FORWARD:
                if (__.target) {
                    if (vec3.dist(__.pos, __.target) > this.maxDist) {
                        __.moveZ(-speed * dt)
                    }
                } else if (__.targetXYZ) {
                    if (vec3.dist(__.pos, vec3(__.targetXYZ.x, __.targetXYZ.y, __.targetXYZ.z)) > this.maxDist) {
                        __.moveZ(-speed * dt)
                    }
                } else {
                    __.moveZ(-speed * dt)
                }
                break
            case dry.STRAFE_LEFT:
                __.moveX(-speed * dt)
                break
            case dry.BACKWARD:
                __.moveZ(speed * dt)
                break
            case dry.STRAFE_RIGHT:
                __.moveX(speed * dt)
                break
            case dry.FLY_UP:
                __.moveY(speed * dt)
                break
            case dry.FLY_DOWN:
                __.moveY(-speed * dt)
                break

            case dry.ZOOM:
                if (factor < 0) this.zoom(-dt)
                else this.zoom(dt)
                // __.zoom(dt)
                break
            /*
            case dry.ZOOM:
                if (factor > 0 || vec3.dist(__.pos, __.lookAt) > this.maxDist) {
                    __.moveZ(factor * dt)
                }
                break
            */

            case dry.YAW:
                __.moveX(this.horizontalTurnSpeed * factor * dt)
                break
            case dry.PITCH:
                __.moveY(this.verticalTurnSpeed * factor * dt)
                break
            case dry.ROLL:
                break

        }
    }

    evo(dt) {
        // activate pushers
        for (let i = 0; i < this.pushers.length; i++) {
            const f = this.pushers[i]
            if (f) {
                this.push(i, f, dt)
                if (i > 20) {
                    if (f > 0) {
                        this.pushers[i] -= dt
                        if (this.pushers[i] < 0) this.pushers[i] = 0
                    } else if (f < 0) {
                        this.pushers[i] += dt
                        if (this.pushers[i] > 0) this.pushers[i] = 0
                    }
                }
                // if (i > 20) this.pushers[i] = 0 // reset the mouse movement accumulation buffers
            }
        }
    }

    actuate(action) {
        this.pushers[action.id] = 1
    }

    act(action) {
    }

    cutOff(action) {
        this.pushers[action.id] = 0
    }

    onMouseDown(e) {
        if (this.mouseCaptureMask && !env.mouseLock) {
            if (e.buttons & this.mouseCaptureMask) {
                lib.util.captureMouse()
            }
        }
    }

    onMouseUp(e) {}

    onMouseMove(e) {
        const pushers = this.pushers
        if (e.buttons & this.mouseMoveMask) {
            const dx = e.movementX, dy = e.movementY

            if (dx) {
                // cancel the opposite movement if necessary
                if (dx < 0 && pushers[dry.YAW] > 0) pushers[dry.YAW] = 0
                if (dx > 0 && pushers[dry.YAW] < 0) pushers[dry.YAW] = 0
                // accumulate horizontal mouse movement
                pushers[dry.YAW] -= dx * this.sensitivity.horizontal
            }
            if (dy) {
                // cancel the opposite movement if necessary
                if (dy < 0 && pushers[dry.PITCH] > 0) pushers[dry.YAW] = 0
                if (dy > 0 && pushers[dry.PITCH] < 0) pushers[dry.YAW] = 0
                // accumulate vertical mouse movement
                this.pushers[dry.PITCH] += dy * this.sensitivity.vertical
            }
        } else if (e.buttons & 2) {
            // TODO
        }
    }

    onMouseWheel(e) {
        this.pushers[dry.ZOOM] += e.deltaY * this.sensitivity.wheel
        // if (e.deltaY !== 0) this.zoom(e.deltaY)
    }

    onPointerLock() {
        this.moveOnClick  = false
        this.reverseYaw   = true
        this.reversePitch = true
    }

    onPointerRelease() {
        this.moveOnClick  = true
        this.reverseYaw   = false
        this.reversePitch = false
    }
}

