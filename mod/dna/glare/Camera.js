class Camera {

    constructor(st) {
        augment(this, {
            pos:   vec3(0, 0, 0),
            dir:   vec3(0, 0, 1),
            up:    vec3(0, 1, 0),
            m4:    mat4(),
        }, st)
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

    viewMatrix() {
        let m
        if (this.target) {
            m = mat43.ilookAt(
                this.pos,
                this.target,
                this.up,
            )
            // fix the attitude based on the look up matrix
            mat43.extractVec3(this.left, m, 0)
            mat43.extractVec3(this.up, m, 1)
            mat43.extractVec3(this.dir, m, 2)

        } else if (this.targetXYZ) {
            const at = vec3(
                this.targetXYZ.x,
                this.targetXYZ.y,
                this.targetXYZ.z,
            )
            m = mat43.ilookAt(
                this.pos,
                this.targetXYZ,
                this.up,
            )
            // fix the attitude based on the look up matrix
            mat43.extractVec3(this.left, m, 0)
            mat43.extractVec3(this.up, m, 1)
            mat43.extractVec3(this.dir, m, 2)

        } else {
            vec3.normalize( this.up, this.up )
            vec3.normalize( this.dir, this.dir )
            this.left = vec3.inormalize( vec3.icross(this.up, this.dir) ),

            m = mat43.fromAxes( this.left, this.up, this.dir, this.pos )
            //m = mat43.identity() // DEBUG use identity in case something goes wrong
            //m[14] = -10         //       with the view tranformations
        }
        // TODO make mat43 invert!
        // mat43.invert(m)
        const m4 = this.m4
        mat43.setMat4(m4, m)
        mat4.invert(m4)
        mat43.setFromMat4(m, m4)

        return m
    }

    getHFOV() {
        return (2 * Math.atan(aspect * Math.tan((this.vfov * DEG_TO_RAD) * .5))) * RAD_TO_DEG
    }

    getVFOV() {
        return this.vfov
    }

}
