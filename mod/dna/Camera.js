const EntityFrame = require('dna/EntityFrame')

class Camera extends EntityFrame {

    constructor(st) {
        const df = {
            vfov:  30,
            zNear: 1,
            zFar:  256,
        }
        if (!st._traits) st._traits = []
        st._traits = extend(st._traits, [ dna.trait.attitudeTrait ])
        super( extend(df, st) )
    }

    capture() {
        if (this.controller) this.controller.capture()
    }

    lookAt(pos) {
        if (isArr(pos)) {
            this.target    = pos
            this.targetXYZ = null
        } else if (isNum(pos)) {
            this.target    = vec3(arguments[0], arguments[1], arguments[2])
            this.targetXYZ = null
        } else if (isObj(pos)) {
            if (isNum(pos.x) && isNum(pos.y) && isNum(pos.z)) {
                this.target    = null
                this.targetXYZ = pos
            } else if (isArr(pos.pos)) {
                this.target    = pos.pos
                this.targetXYZ = null
            }
        }
    }

    release() {
        this.target    = null
        this.targetXYZ = null
    }
    
    projectionMatrix() {
        const aspect = gl.canvas.width / gl.canvas.height
        return mat4.iperspective(this.vfov, gl.canvas.width/gl.canvas.height, this.zNear, this.zFar)

        /*
        // set the frustum
        const w = 10,
              h = w / aspect,
              hw = .5 * w,
              hh = .5 * h
        return mat4.ifrustum(-hw, hw, -hh, hh, this.zNear, this.zFar)
        */

        /*
        // ortho projection
        const w = 10,
              h = w / aspect,
              hw = .5 * w,
              hh = .5 * h
        return mat4.iortho(-hw, hw, -hh, hh, -this.zNear, -this.zFar)
        */
    }

    viewMatrix() {
        let m
        if (this.target) {
            m = mat4.lookAt(
                this.pos,
                this.target,
                this.up,
            )
            // fix the attitude based on the look up matrix
            this.left = mat4.extractV3(m, 0)
            this.up   = mat4.extractV3(m, 1)
            this.dir  = mat4.extractV3(m, 2)

        } else if (this.targetXYZ) {
            const at = vec3(
                this.targetXYZ.x,
                this.targetXYZ.y,
                this.targetXYZ.z,
            )
            m = mat4.lookAt(
                this.pos,
                this.targetXYZ,
                this.up,
            )
            // fix the attitude based on the look up matrix
            this.left = mat4.extractV3(m, 0)
            this.up   = mat4.extractV3(m, 1)
            this.dir  = mat4.extractV3(m, 2)

        } else {
            vec3.normalize( this.up, this.up )
            vec3.normalize( this.dir, this.dir )
            this.left = vec3.inormalize( vec3.icross(this.up, this.dir) ),

            m = mat4.from4V3( this.left, this.up, this.dir, this.pos )
            //m = mat4.identity() // DEBUG use identity in case something goes wrong
            //m[14] = -10         //       with the view tranformations
        }
        mat4.invert(m)

        return m
    }

    evo(dt) {
        super.evo(dt)

        // TODO move to a probe
        if (env.debug) {
            pin.info.set('Cam',
                  'pos:'  + lib.dump.vec3(this.pos, 1)
                + ' dir:' + lib.dump.vec3(this.dir, 1)
                + ' up:'  + lib.dump.vec3(this.up, 1)
            )
        }
    }

    pick() {
        // calculate the proper ray vector
        const cdir = vec3.clone(this.dir)
        vec3.scale(cdir, -1)
        const pos = this.pos
        const ignored = this.__

        return lab.apply((e, collector) => {
            if (e !== ignored && e.solid) {
                const rayHit = e.solid.touchRay(pos, cdir)
                if (rayHit) collector.push(rayHit)
            }
        }, [])
    }

    getHFOV() {
        return (2 * Math.atan(aspect * Math.tan((this.vfov * DEG_TO_RAD) * .5))) * RAD_TO_DEG
    }

    getVFOV() {
        return this.vfov
    }
}
