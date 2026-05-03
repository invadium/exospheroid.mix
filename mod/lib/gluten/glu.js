const
    UNIFORM_1I         = 11,
    UNIFORM_1IV        = 12,
    UNIFORM_1F         = 13,
    UNIFORM_1FV        = 14,

    UNIFORM_2I         = 21,
    UNIFORM_2IV        = 22,
    UNIFORM_2F         = 23,
    UNIFORM_2FV        = 24,

    UNIFORM_3I         = 31,
    UNIFORM_3IV        = 32,
    UNIFORM_3F         = 33,
    UNIFORM_3FV        = 34,

    UNIFORM_4I         = 41,
    UNIFORM_4IV        = 42,
    UNIFORM_4F         = 43,
    UNIFORM_4FV        = 44,

    UNIFORM_MATRIX_2FV = 102,
    UNIFORM_MATRIX_3FV = 103,
    UNIFORM_MATRIX_4FV = 104

let context = {
    env:         {},
    progStack:   [],

    ptr:         0,
    matrixStack: [],
}

const __glu__ = {

    // state
    prog:      null,
    glProg:       null,

    modelMatrix:  mat4.identity(),
    invMatrix:    mat4.identity(),
    normalMatrix: mat4.identity(),

    init: function() {
        // migrate in the global scope and detach,
        // since we don't want to use it from here by mistake
        // We MUST declare functions here and not on /alt to have vector and matrix math available in scope
        extend($.alt.glu, this, p => !p.startsWith('_') && p !== 'name' && p !== 'init')
        this.__.detach(this)
    },

    pushProgram: function() {
        context.progStack.push(context.env)
    },

    popProgram: function() {
        if (context.progStack.length === 0) throw new Error(`Can't pop() - GLU Program stack is empty!`)
        context.env = context.progStack.pop()

        const gluProg = context.env.prog
        gl.useProgram(gluProg.glRef)
        this.prog      = gluProg
        this.uniform   = gluProg.uniform
        this.attribute = gluProg.attribute
        this.glProg    = gluProg.glRef
    },

    withUniforms: function(appliedUniforms, local) {
        if (!appliedUniforms || appliedUniforms.length === 0) return

        appliedUniforms.forEach(au => {
            if (!au.local || local) {
                // find gl location for the new program
                // TODO also match by the uniform type!!!
                const newUniform = this.uniform[au.uniform.name]
                if (newUniform && au.uniform.type === newUniform.type) {
                    switch(au.method) {
                        case UNIFORM_1I:  this.uniform1i (newUniform, au.i0); break;
                        case UNIFORM_1IV: this.uniform1iv(newUniform, au.iv); break;
                        case UNIFORM_1F:  this.uniform1f (newUniform, au.f0); break;
                        case UNIFORM_1FV: this.uniform1fv(newUniform, au.fv); break;

                        case UNIFORM_2I:  this.uniform2i (newUniform, au.i0, au.i1); break;
                        case UNIFORM_2IV: this.uniform2iv(newUniform, au.iv); break;
                        case UNIFORM_2F:  this.uniform2f (newUniform, au.f0, au.f1); break;
                        case UNIFORM_2FV: this.uniform2fv(newUniform, au.fv); break;

                        case UNIFORM_3I:  this.uniform3i (newUniform, au.i0, au.i1, au.i2); break;
                        case UNIFORM_3IV: this.uniform3iv(newUniform, au.iv); break;
                        case UNIFORM_3F:  this.uniform3f (newUniform, au.f0, au.f1, au.f2); break;
                        case UNIFORM_3FV: this.uniform3fv(newUniform, au.fv); break;

                        case UNIFORM_4I:  this.uniform4i (newUniform, au.i0, au.i1, au.i2, au.i3); break;
                        case UNIFORM_4IV: this.uniform4iv(newUniform, au.iv); break;
                        case UNIFORM_4F:  this.uniform4f (newUniform, au.f0, au.f1, au.f2, au.f3); break;
                        case UNIFORM_4FV: this.uniform4fv(newUniform, au.fv); break;

                        case UNIFORM_MATRIX_2FV: this.uniformMatrix2fv(newUniform, au.fv); break;
                        case UNIFORM_MATRIX_3FV: this.uniformMatrix3fv(newUniform, au.fv); break;
                        case UNIFORM_MATRIX_4FV: this.uniformMatrix4fv(newUniform, au.fv); break;
                    }
                }
            }
        })
    },

    withLocalUniforms: function(uniforms) {
        this.withUniforms(uniforms, true)
    },

    withProgram: function(gluProg, rejectUniforms) {
        //log('with program: ' + gluProg.name)

        if (this.prog === gluProg) {
            this.pushProgram()
            return
        }

        if (this.prog) {
            this.pushProgram()
        }

        gl.useProgram(gluProg.glRef)
        this.prog      = gluProg
        this.uniform   = gluProg.uniform
        this.attribute = gluProg.attribute
        this.glProg    = gluProg.glRef

        // create new program environment and inherit uniforms if not rejected
        const parentUniforms = context.env.uniforms
        context.env = {
            prog: gluProg,
            uniforms: [],
        }
        if (!rejectUniforms) this.withUniforms(parentUniforms)
    },

    prevProgram: function() {
        this.popProgram()
        this.withUniforms(context.env.uniforms)
    },

    validateUniform(uniform) {
        let uniformName = 'unknown'
        if (isStr(uniform)) {
            uniformName = uniform
            uniform = this.uniform[uniform]
        }

        if (uniform) return uniform

        if (env.config.failOnMissingUniform) throw new Error(`Missing the uniform: [${uniformName}]!`)
    },

    uniform1i: function(uniform, v0, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform1i(uniform.glLoc, v0)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_1I,
            uniform:  uniform,
            v0:       v0,
        })
    },

    uniform1iv: function(uniform, iv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform1iv(uniform.glLoc, iv)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_1IV,
            uniform:  uniform,
            iv:       iv,
        })
    },

    uniform1f: function(uniform, f0, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform1f(uniform.glLoc, f0)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_1F,
            uniform:  uniform,
            f0:       f0,
        })
    },

    uniform1fv: function(uniform, fv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform1fv(uniform.glLoc, fv)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_1FV,
            uniform:  uniform,
            fv:       fv,
        })
    },
    
    uniform2i: function(uniform, i0, i1, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform2i(uniform.glLoc, i0, i1)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_2I,
            uniform:  uniform,
            i0:       i0,
            i1:       i1,
        })
    },

    uniform2iv: function(uniform, iv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform2iv(uniform.glLoc, iv)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_2IV,
            uniform:  uniform,
            iv:       iv,
        })
    },

    uniform2f: function(uniform, f0, f1, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform2f(uniform.glLoc, f0, f1)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_2F,
            uniform:  uniform,
            f0:       f0,
            f1:       f1,
        })
    },

    uniform2fv: function(uniform, fv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform2fv(uniform.glLoc, fv)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_2FV,
            uniform:  uniform,
            fv:       fv,
        })
    },

    uniform3i: function(uniform, i0, i1, i2, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform3i(uniform.glLoc, i0, i1, i2)

        context.env.uniforms.push({
            local:   !!local,
            method:  UNIFORM_3I,
            uniform: uniform,
            i0:      i0,
            i1:      i1,
            i2:      i2,
        })
    },

    uniform3iv: function(uniform, iv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform3iv(uniform.glLoc, iv)

        context.env.uniforms.push({
            local:   !!local,
            method:  UNIFORM_3IV,
            uniform: uniform,
            iv:      iv,
        })
    },

    uniform3f: function(uniform, f0, f1, f2, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform3f(uniform.glLoc, f0, f1, f2)

        context.env.uniforms.push({
            local:   !!local,
            method:  UNIFORM_3F,
            uniform: uniform,
            f0:      f0,
            f1:      f1,
            f2:      f2,
        })
    },

    uniform3fv: function(uniform, fv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform3fv(uniform.glLoc, fv)

        context.env.uniforms.push({
            local:   !!local,
            method:  UNIFORM_3FV,
            uniform: uniform,
            fv:      fv,
        })
    },

    uniform4i: function(uniform, i0, i1, i2, i3, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform4i(uniform.glLoc, i0, i1, i2, i3)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_4I,
            uniform:  uniform,
            i0:       i0,
            i1:       i1,
            i2:       i2,
            i3:       i3,
        })
    },

    uniform4iv: function(uniform, iv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform4iv(uniform.glLoc, iv)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_4IV,
            uniform:  uniform,
            iv:       iv,
        })
    },

    uniform4f: function(uniform, f0, f1, f2, f3, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform4f(uniform.glLoc, f0, f1, f2, f3)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_4F,
            uniform:  uniform,
            f0:       f0,
            f1:       f1,
            f2:       f2,
            f3:       f3,
        })
    },

    uniform4fv: function(uniform, fv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniform4fv(uniform.glLoc, fv)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_4FV,
            uniform:  uniform,
            fv:       fv,
        })
    },

    uniformMatrix2fv: function(uniform, fv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniformMatrix2fv(uniform.glLoc, false, fv)

        context.env.uniforms.push({
            local:   !!local,
            method:  UNIFORM_MATRIX_2FV,
            uniform: uniform,
            fv:      fv,
        })
    },

    uniformMatrix3fv: function(uniform, fv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniformMatrix3fv(uniform.glLoc, false, fv)

        context.env.uniforms.push({
            local:   !!local,
            method:  UNIFORM_MATRIX_3FV,
            uniform: uniform,
            fv:      fv,
        })
    },

    uniformMatrix4fv: function(uniform, fv, local) {
        uniform = this.validateUniform(uniform)
        if (!uniform) return

        gl.uniformMatrix4fv(uniform.glLoc, false, fv)

        context.env.uniforms.push({
            local:   !!local,
            method:  UNIFORM_MATRIX_4FV,
            uniform: uniform,
            fv:      fv,
        })
    },

    applyModelMatrix: function(local) {
        if (!this.uniform.uModelMatrix) return
        gl.uniformMatrix4fv(this.uniform.uModelMatrix.glLoc, false, this.modelMatrix)

        context.env.uniforms.push({
            local:   !!local,
            method:  UNIFORM_MATRIX_4FV,
            uniform: this.uniform.uModelMatrix,
            fv:      mat4.clone(this.modelMatrix),
        })
    },

    applyNormalMatrix: function(local) {
        if (!this.uniform.uNormalMatrix) return

        // calculate the normal matrix out of the model one (model => invert => transpose)
        mat4.copy(this.invMatrix, this.modelMatrix)
        mat4.invert(this.invMatrix)
        mat4.transpose(this.normalMatrix, this.invMatrix)
        gl.uniformMatrix4fv(this.uniform.uNormalMatrix.glLoc, false, this.normalMatrix)

        context.env.uniforms.push({
            local:    !!local,
            method:   UNIFORM_MATRIX_4FV,
            uniform:  this.uniform.uNormalMatrix,
            fv:       mat4.clone(this.normalMatrix),
        })
    },

    pushMatrix: function() {
        if (!context.matrixStack[context.ptr]) context.matrixStack[context.ptr++] = mat4.clone(this.modelMatrix)
        else mat4.copy(context.matrixStack[context.ptr++], this.modelMatrix)
    },

    popMatrix: function () {
        if (context.ptr === 0) throw new Error(`The GLU matrix stack is empty!`)
        mat4.copy(this.modelMatrix, context.matrixStack[--context.ptr])
    },

    setIdentity: function () {
        mat4.setIdentity(this.modelMatrix)
    },

    translate: function (pos) {
        mat4.translate( this.modelMatrix, pos )
        return this
    },

    rot: function(rv) {
        mat4.rot( this.modelMatrix, rv )
        return this
    },

    scale: function(sv) {
        mat4.scale( this.modelMatrix, sv )
        return this
    },

    save: function() {
        this.pushMatrix()
    },

    restore: function() {
        this.popMatrix()
    },

    getContext: function() {
        return context
    },
}

module.exports = __glu__
