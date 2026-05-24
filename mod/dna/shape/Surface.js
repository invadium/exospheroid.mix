// Surface combines the geometry mesh data and materials to create
// a renderable surface along with render configuration data.

let id = 0

const OPT_WIREFRAME = 1
const OPT_TEXTURE   = 2

class Surface {

    constructor(st) {
        extend(this, {
            name: 'surface' + (++id),

            renderOpt: vec4(1, 0, 0, 0), // render options
            //renderOpt: vec4(1, 1, 1, 1), // render options buf: {},

            buf: {},
        }, st)

        if (!st.m && st.geo.m) {
            this.m = st.geo.m
        }

        // create buffers
        function createBuffer(data, type) {
            if (data) {
                const buffer = gl.createBuffer()
                gl.bindBuffer(type, buffer)
                gl.bufferData(type, data, gl.STATIC_DRAW)
                return buffer
            }
            return null
        }

        // TODO ELEMENT_ARRAY_BUFFERS also must be created in the process
        for (let bname of this.geo.BUFFERS) {
            const type = (bname === 'faces')? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER
            this.buf[bname] = createBuffer(this.geo[bname], type)
        }
        //this.buf.v = this.createBuffer(this.geo.v)
        //this.buf.n = this.createBuffer(this.geo.n)
        //this.buf.w = this.createBuffer(this.geo.w)
        //this.buf.c = this.createBuffer(this.geo.c)
        //this.buf.u = this.createBuffer(this.geo.u)
        //this.buf.f = this.createBuffer(this.geo.f, gl.ELEMENT_ARRAY_BUFFER)
    }

    // TODO maybe move to glu along with buffer creation?
    bindAttribute(buf, name, nElements) {
        if (!buf) return
        const attribute = glu.attribute[name]
        if (attribute === undefined) return
        gl.enableVertexAttribArray(attribute.glLoc)
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.vertexAttribPointer(attribute.glLoc, nElements || 3, gl.FLOAT, false, 0, 0)
    }

    preDraw() {
        const uniform = glu.uniform

        // adjust to the world coordinates
        // set current model matrix
        glu.applyModelMatrix()
        glu.applyNormalMatrix()

        // rendering options
        if (this.tex) this.renderOpt[OPT_TEXTURE] = 1
        else this.renderOpt[OPT_TEXTURE] = 0
        glu.uniform4fv('uOpt', this.renderOpt)

        // -------------------------------------
        // bind our geometry and materials

        // set the material
        glu.uniform4fv( uniform.uMatAmbient,   this.m.a )
        glu.uniform4fv( uniform.uMatDiffuse,   this.m.d )
        glu.uniform4fv( uniform.uMatSpecular,  this.m.s )
        glu.uniform1f( 'uSpecularExponent', this.m.n )

        if (this.tex) {
            // bind texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            glu.uniform1i(uniform.uTexture, 0);
        }

        // set the shader attributes 
        this.bindAttribute(this.buf.vertices, 'aVertPos'  )
        this.bindAttribute(this.buf.normals,  'aVertNorm' )
        this.bindAttribute(this.buf.colors,   'aVertColor')
        this.bindAttribute(this.buf.uvs,      'aVertUV',    2)
    }

    postDraw() {
    }

    draw() {
        this.preDraw()

        if (this.renderOpt[OPT_WIREFRAME]) {
            // render wireframes
            gl.lineWidth(2)
            this.bindAttribute(this.buf.wires, 'aVertPos')
            gl.drawArrays(gl.LINES, 0, this.geo.wires.length / 3) 
        } else if (this.buf.faces) {
            // TODO can't support multiple indexes at once,
            //      so obj models MUST be repacked to be index by a sinlge index array
            //      and multiple data buffers
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buf.faces)
            gl.drawElements(gl.TRIANGLES, this.geo.faceCount, gl.UNSIGNED_SHORT, 0)

            if (env.debug) env.stat.polygons += this.geo.fc / 3
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.geo.vertCount)
            if (env.debug) env.stat.polygons += this.geo.vc / 3
        }

        this.postDraw()
    }
}
Surface.OPT_WIREFRAME = 1
Surface.OPT_TEXTURE   = 2

