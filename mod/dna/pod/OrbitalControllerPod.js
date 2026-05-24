const
    FLY_UP      = 10,
    FLY_DOWN    = 11,
    ROLL_LEFT   = 12,
    ROLL_RIGHT  = 13

class OrbitalControllerPod {

    constructor(st) {
        extend(this, {
            name:      'controller',
            speed:     20,
            turnSpeed: PI,
            r:         10,
            maxDist:   3,

            zoomSpeed:       .005,
            minFOV:           1,
            maxFOV:           120,

            mouseCaptureMask: 2,
            moveOnClick:      true,
            mouseMoveMask:    4,

            reversePitch:     false,
            reverseYaw:       false,
        }, st)

        this.pushers = new Float32Array(32)
    }

    init() {
        this.capture()
    }

    capture() {
        this.disabled = false
        lab.monitor.mouseBroker = this
        lab.monitor.controller.bindAll(this)
    }

    release() {
        this.disabled = true
        if (lab.monitor.mouseBroker === this) {
            lab.monitor.mouseBroker = null
            lab.monitor.controller.unbindAll(this)
        }
    }

    zoom(delta) {
        const __ = this.__
        __.vfov = clamp(__.vfov + delta * this.zoomSpeed, this.minFOV, this.maxFOV)
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
        const __ = this.__
        const speed     = this.speed
        const turnSpeed = this.turnSpeed

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
                if (factor > 0 || vec3.dist(__.pos, __.lookAt) > this.maxDist) {
                    __.moveZ(factor * dt)
                }
                break

            case dry.YAW:
                __.moveX(speed * factor * dt)
                break
            case dry.PITCH:
                __.moveY(speed * factor * dt)
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
                if (i > 20) this.pushers[i] = 0 // reset the mouse movement accumulation buffers
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
        if (e.buttons & this.mouseMoveMask) {
            const dx = e.movementX, dy = e.movementY

            if (dx) {
                // accumulate horizontal mouse movement
                this.pushers[dry.YAW] -= dx
            }
            if (dy) {
                // accumulate vertical mouse movement
                this.pushers[dry.PITCH] += dy
            }
        } else if (e.buttons & 2) {
            // TODO
        }
    }

    onMouseWheel(e) {
        if (e.deltaY !== 0) this.zoom(e.deltaY)
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

