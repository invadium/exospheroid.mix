// a container for WebGL viewport
class Viewport extends sys.LabFrame {

    constructor(st) {
        super( augment({
            name:  'port',

            cam:    null,
            prog:   null,

            hidden: false,
        }, st) )
    }

    setup() {
        this.prog = lib.glsl.zprog.flat
    }

    bindCamera(cam) {
        if (!(cam instanceof dna.Camera)) throw new Error(`Wrong camera entity - it is supposed to be an instance of dna.Camera!`)
        this.cam = pin.cam = cam
    }

    setupDraw() {
        glu.withProgram(this.prog)
        //glu.withProgram(lib.glsl.zprog.flat)
        //glu.withProgram(lib.glsl.zprog.plainColor)

        gl.enable(gl.DEPTH_TEST)
        gl.depthFunc(gl.LEQUAL)
        gl.disable(gl.CULL_FACE)
        //gl.enable(gl.CULL_FACE)

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
        gl.clearDepth(1.0)
        gl.clearColor(.11, .02, .13, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    }

    applyMVP() {
        const cam = this.cam
        glu.uniformMatrix4fv(glu.uniform.uProjectionMatrix, cam.projectionMatrix())
        glu.uniformMatrix4fv(glu.uniform.uViewMatrix, cam.viewMatrix())
        glu.applyModelMatrix()
    }

    setUniforms() {
        const cam     = this.cam,
              uniform = glu.uniform

        // setup up the view and projection transformations
        // TODO merge view and projection into the pv matrix and get it from the camera
        glu.uniformMatrix4fv(uniform.uProjectionMatrix, cam.projectionMatrix())
        glu.uniformMatrix4fv(uniform.uViewMatrix, cam.viewMatrix())

        // set the model matrix to identity
        // mat4.copy(this.modelMat4, this.inversedMat4)
        glu.setIdentity()
        glu.applyModelMatrix()

        glu.uniform3fv(uniform.uCamPos, cam.pos)

        // TODO precalc in _dirLight buffer and use that instead?
        const nDirLightVec = vec3.clone(env.aura.dirLightVec)
        vec3.scale(nDirLightVec, nDirLightVec, -1)
        vec3.normalize(nDirLightVec, nDirLightVec)

        glu.uniform3fv(uniform.uDirLightVec,   nDirLightVec)
        glu.uniform4fv(uniform.uDirLightColor, env.aura.dirLightColor)

        // set point light uniforms
        glu.uniform3fv(uniform.uPointLights, env.aura.pointLights)
        glu.uniform4fv(uniform.uPointLightColors, env.aura.pointLightColors)

        // tune - fog color
        glu.uniform4fv(uniform.uFogDepth, vec4.rgba('#1d0722FF'))
    }

    postDraw() {
        glu.prevProgram()
    }

    draw() {
        if (!glu.glProg || !this.cam) return

        this.setupDraw()

        // TODO move out to a debug node?
        if (env.debug) {
            env.stat.lastPolygons = env.stat.polygons
            env.stat.polygons = 0
        }

        /*
        if (env.backfaces) {
            gl.disable(gl.CULL_FACE)
        } else {
            gl.enable(gl.CULL_FACE)
            gl.cullFace(gl.BACK)
        }
        */

        this.setUniforms()

        // draw the scene graph
        super.draw()

        this.postDraw()
    }

    unbindCamera() {
        this.cam = null
    }
}
