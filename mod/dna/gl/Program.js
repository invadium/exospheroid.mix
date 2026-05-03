let id = 0

class Program {

    constructor(st) {
        augment(this, {
            id:        ++id,
            uniform:   {},
            attribute: {},
        }, st)

        this.parse()
        this.register()
        this.glRef = gl.createProgram()
    }

    parse() {
        if (!this.src) throw new Error(`[${id}:${name}] program source is missing!`)

        const paths = this.src.trim().split(':')
        if (paths.length !== 2) {
            throw new Error(`[${id}:${name}] a vertex and a fragment shader paths are expected in .prog`)
        }
        this.vertexPath   = paths[0]
        this.fragmentPath = paths[1]
    }

    register() {
        if (!lib._programCatalog) lib._programCatalog = []
        lib._programCatalog.push(this)
    }

    bindShaders() {
        const vShader = this.vShader = __$.selectOne(this.vertexPath)
        const fShader = this.fShader = __$.selectOne(this.fragmentPath)

        if (!vShader) throw `[${this.id}:${this.name}] Can't find vertex shader @[${this.vertexPath}]`
        if (!(vShader instanceof dna.gl.Shader) || vShader.type !== 'vertex') {
            console.dir(vShader)
            throw `Wrong Shader! Expecting a vertex shader @[${this.vertexPath}]`
        }
        if (!fShader) throw `[${this.id}:${this.name}] Can't find fragment shader @[${this.fragmentPath}]`
        if (!(fShader instanceof dna.gl.Shader) || fShader.type !== 'fragment') {
            console.dir(fShader)
            throw `Wrong Shader! Expecting a fragment shader @[${this.vertexPath}]`
        }
    }

    bindLocations(shader) {
        if (!shader.defs) return

        shader.defs.uniform.forEach(uniform => {
            this.uniform[uniform.name] = {
                __:    this,
                type:  uniform.type,
                name:  uniform.name,
                glLoc: gl.getUniformLocation(this.glRef, uniform.name)
            }
        })

        if (shader.glType === gl.VERTEX_SHADER) {
            shader.defs.in.forEach(attribute => {
                this.attribute[attribute.name] = {
                    __:    this,
                    type:  attribute.type,
                    name:  attribute.name,
                    glLoc: gl.getAttribLocation(this.glRef, attribute.name)
                }
            })
        }
    }

    link() {
        this.bindShaders()

        const glRef = this.glRef
        gl.attachShader(glRef, this.vShader.glRef)
        gl.attachShader(glRef, this.fShader.glRef)

        gl.linkProgram(glRef)
        gl.validateProgram(glRef)
        if (!gl.getProgramParameter(glRef, gl.VALIDATE_STATUS)) {
            const glLog = gl.getProgramInfoLog(glRef)
            throw new Error(`[${this.id}:${this.name}] unable to link the program: ${glLog}`)
        }

        this.bindLocations(this.vShader)
        this.bindLocations(this.fShader)

        // won't work with multiple programs!
        this.use()
    }

    use() {
        glu.withProgram(this)
    }

    destruct() {
        gl.detachShader(this.fShader.glRef)
        gl.detachShader(this.vShader.glRef)
        gl.deleteProgram(this.glRef)
    }
}
