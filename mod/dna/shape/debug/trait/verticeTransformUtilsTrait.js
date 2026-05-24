const verticeTransformUtilsTrait = {

    orig() {
        this.vertices = this.origVertices.map(e => e)
        return this
    },

    applyP1(vx, fn) {
        for (let i = 0; i < vx.length; i++) {
            const v = vx[i]
            const w = fn(v)
            vx[i] = w
        }
    },

    applyP3(vx, fn) {
        for (let i = 0; i < vx.length; i += 3) {
            const x = vx[i], y = vx[i+1], z = vx[i+2]
            const v3 = fn(x, y, z)
            vx[i] = v3[0]
            vx[i+1] = v3[1]
            vx[i+2] = v3[2]
        }
    },

    applyV3(vx, fn) {
        for (let i = 0; i < vx.length; i += 3) {
            const v3 = vec3.fromArray(vx, i)
            fn(v3)
            vx[i] =   v3[0]
            vx[i+1] = v3[1]
            vx[i+2] = v3[2]
        }
    },

    scale(s) {
        this.applyP1(this.vertices, v => v * s)
        return this
    },

    translate(x, y, z) {
        const tv3 = vec3(x, y, z)
        this.applyV3(this.vertices, v3 => vec3.add(v3, v3, tv3))
        return this
    },

    translateV3(tv3) {
        this.applyV3(this.vertices, v3 => vec3.add(v3, v3, tv3))
        return this
    },

    rotX(theta) {
        this.applyV3(this.vertices, v3 => vec3.rotateX(v3, v3, theta))
        return this
    },

    rotY(theta) {
        this.applyV3(this.vertices, v3 => vec3.rotateY(v3, v3, theta))
        return this
    },

    rotZ(theta) {
        this.applyV3(this.vertices, v3 => vec3.rotateZ(v3, v3, theta))
        return this
    },
}
