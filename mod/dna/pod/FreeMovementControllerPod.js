/*
 * Captures keyboard and mouse controls and allows 6-degree of freedom node movement.
 */
class FreeMovementControllerPod {

    constructor(st) { extend(this, {
            name:            'freeMovementController',
            alias:           'controller',
            speed:            20,
            turnSpeed:        1,
            zoomSpeed:       .005,
            minFOV:           1,
            maxFOV:           120,
            mouseCaptureMask: 2,
            moveOnClick:      true,
            mouseMoveMask:    7,

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
        this.__.release()
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

    zoom(delta) {
        const __ = this.__
        __.vfov = clamp(__.vfov + delta * this.zoomSpeed, this.minFOV, this.maxFOV)
    }

    push(action, factor, dt) {
        const __ = this.__
        const speed     = this.speed
        const turnSpeed = this.turnSpeed
        switch(action) {
            case dry.FORWARD:
                __.moveZ(-speed * dt)
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

            case dry.LOOK_LEFT:
                __.yaw(-turnSpeed * dt)
                break
            case dry.LOOK_RIGHT:
                __.yaw(turnSpeed * dt)
                break
            case dry.LOOK_UP:
                __.pitch(-turnSpeed * dt)
                break
            case dry.LOOK_DOWN:
                __.pitch(turnSpeed * dt)
                break
            case dry.ROLL_LEFT:
                __.roll(turnSpeed * dt)
                break
            case dry.ROLL_RIGHT:
                __.roll(-turnSpeed * dt)
                break

            case dry.YAW:
                if (this.reverseYaw) __.yaw(-turnSpeed * factor * dt)
                else __.yaw(turnSpeed * factor * dt)
                break
            case dry.PITCH:
                if (this.reversePitch) __.pitch(-turnSpeed * factor * dt)
                else __.pitch(turnSpeed * factor * dt)
                break
            case dry.ROLL:
                __.roll(turnSpeed * factor * dt)
                break
        }
    }

    evo(dt) {
        // activate pushers
        for (let i = 0; i < this.pushers.length; i++) {
            const f = this.pushers[i]
            if (f) {
                this.push(i, f, dt)
                if (i >= dry.YAW) this.pushers[i] = 0 // reset the mouse movement accumulation buffers
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
        if (this.moveOnClick && !(e.buttons & this.mouseMoveMask)) return

        const dx = e.movementX, dy = e.movementY

        if (dx) {
            if (e.shiftKey) {
                // accumulate mouse roll
                this.pushers[dry.ROLL] += dx * .1
            } else {
                // accumulate horizontal mouse movement
                this.pushers[dry.YAW] -= dx * .1
            }
        }
        if (dy) {
            // accumulate vertical mouse movement
            this.pushers[dry.PITCH] += dy * 0.075
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
