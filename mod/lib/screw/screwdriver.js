// geometry (mesh/material/data) direct generator
// TODO how to merge these functions with unscrew interpreter? can they be shared?
//      they are essentially doing the same thing!
const screwdriver = (() => {

const flags = {
    UV:     true,
    smooth: false,
}
const stack  = [],
      mstack = []

// === geo state ===
let geo
let x,y,z,w,                // working registers
    M = mat4.identity(),    // current geo model matrix
    P = 13,                 // current precision qualifier
    S                       // smooth flag, sharp if not set
// let s = [], m = [], b = [] // value and matrix stacks

function push(x)  {
    stack.push(x)
}

function pop() {
    return stack.pop()
}

function peek() {
    return stack[stack.length - 1]
}

function popV4() {
    w = pop()
    z = pop()
    y = pop()
    x = pop()
    return vec4(x, y, z, w)
}

// apply a function for each vertice value
function vxApply(fn) {
    for (let i = 0; i < geo.vertices.length; i++) {
        geo.vertices[i] = fn(geo.vertices[i], i)
    }
}

// apply function to x/y/z vertex tripplets
function v3c(fn) {
    let swap = true, bv, ln = g.v.length
    for (let i = 0; i < ln; i += 3) {
        const x = g.v[i], y = g.v[i+1], z = g.v[i+2]
        const v = fn(x, y, z)
        if (swap && i % 9 === 3) {
            bv = v
        } else {
            v3x(v)
            if (swap && i % 9 === 6 && bv) {
                v3x(bv)
            }
        }
    }
}

// apply current model matrix to provided array and push values
function wM(w) {
    for (let i = 0; i < w.length; i += 3) {
        v3x(vec3(w[i], w[i+1], w[i+2]))
    }
}

// apply the geo matrix to vec3 and push the results to vertices
function v3x(v) {
    vec3.mulM4(v, M)
    g.v.push(v[0])
    g.v.push(v[1])
    g.v.push(v[2])
}

// merge x/y/z into a vec3, apply the geo matrix and push the results to vertices
function vx(x, y, z) {
    const v = vec3(x, y, z)
    vec3.mulM4(v, M)
    g.v.push(v[0])
    g.v.push(v[1])
    g.v.push(v[2])
}

// apply geo transformations to nx before pushing in
function nx(x, y, z) {
    const v = vec3(x, y, z)
    vec3.mulM4(v, M)
    geo.normals.push(v[0])
    geo.normals.push(v[1])
    geo.normals.push(v[2])
}

function rgb(r, g, b) {
    geo.colors.push(r)
    geo.colors.push(g)
    geo.colors.push(b)
}

// pop vec3 from the stack
function pv3() {
    z = pop(), y = pop(), x = pop()
    return vec3(x, y, z)
}
    
const $ = {
    gen: function() {
        // TODO should be a class? We defining it in 2 different places
        geo = {
            vertices: [],
            normals:  [],
            faces:    [],
            colors:   [],
            uvs:      [],

            BUFFERS: ['vertices', 'normals', 'wires', 'colors', 'uvs'],
        }
        return this
    },
    push: v => {
        stack.push(v)
        return $
    },
    pushv: w => {
        for (x of w) stack.push(x)
        return $
    },
    drop: () => {
        pop()
    },
    swap: () => {
        const v1 = pop(), v2 = pop()
        stack.push(v1)
        stack.push(v2)
    },
    mpush: () => {
        mstack.push( mat4.clone(geoMatrix) )
    },
    mpop: () => {
        geoMatrix = mstack.pop()
    },

    // basic ops
    add: () => {
        stack.push( pop() + pop() )
    },

    sub: () => {
        const v = pop()
        stack.push( pop() - v )
    },

    mul: () => {
        stack.push( pop() * pop() )
    },

    div: () => {
        const v = pop()
        stack.push( pop() / v )
    },

    precision: function(v) {
        geoSpherePrecision = v || pop()
        return this
    },

    smooth: function() {
        flags.smooth = 1
        return this
    },

    sharp: function() {
        flags.smooth = 0
        return this
    },

    vertices: function(w) {
        for (let i = 0; i < w.length; i += 3) {
            vx(w[i], w[i+1], w[i+2])
        }
        //geo.vertices = geo.vertices.concat(w)
        return this
    },

    faces: function(fv) {
        geo.faces = geo.faces.concat(fv)
        return this
    },

    normals: function(w) {
        for (let i = 0; i < w.length; i += 3) {
            nx(w[i], w[i+1], w[i+2])
        }
        //geo.normals = geo.normals.concat(nv)
        return this
    },

    colors: function(w) {
        for (let i = 0; i < w.length; i += 3) {
            rgb(w[i], w[i+1], w[i+2])
        }
        return this
    },

    randomColors: function() {
        for (let i = 0; i < geo.vertices.length / 3; i++) {
            rgb(rnd(), rnd(), rnd())
        }
        return this
    },

    uvs: function(uw) {
        geo.uvs = geo.uvs.concat(uw)
        return this
    }, 

    tri: function() {
        for (let i = 0; i < 9; i += 3) {
            const z = pop(), y = pop(), x = pop()
            vx(x, y, z)
        }
    },

    plane: function() {
        geo.vertices = geo.vertices.concat([
            -1, 0,-1,  1, 0, 1,  1, 0,-1,    
            -1, 0,-1, -1, 0, 1,  1, 0, 1
        ])
        return this
    },

    cube: function() {
        geo.vertices = geo.vertices.concat([
            // top face
            -1, 1,-1,  -1, 1, 1,   1, 1, 1,
            -1, 1,-1,   1, 1, 1,   1, 1,-1,   

            // back face
            -1,-1,-1,  -1, 1,-1,   1, 1,-1,
            -1,-1,-1,   1, 1,-1,   1,-1,-1,

            // left face
            -1,-1,-1,  -1,-1, 1,  -1, 1, 1,
            -1,-1,-1,  -1, 1, 1,  -1, 1,-1,

            // front face
            -1,-1, 1,   1,-1, 1,   1, 1, 1,
            -1,-1, 1,   1, 1, 1,  -1, 1, 1,

            // right face
            1,-1,-1,   1, 1,-1,   1, 1, 1,
            1,-1,-1,   1, 1, 1,   1,-1, 1,

            // bottom face
            -1,-1,-1,  1,-1,-1,   1,-1, 1,
            -1,-1,-1,  1,-1, 1,  -1,-1, 1,
        ])

        if (flags.UV) {
            geo.uvs = geo.uvs.concat([
                1, 0,   1, 1,   0, 1,
                1, 0,   0, 1,   0, 0,
            ])
            for (let j = 0; j < 12; j++) {
                for (let i = 0; i < 12; i++) {
                    geo.uvs.push(geo.uvs[i])
                }
            }
        }
        return this
    },

    tetrahedron: function() {
        geo.vertices = geo.vertices.concat([
            -1, 1,-1,   -1,-1, 1,   1, 1, 1,
             1, 1, 1,    1,-1,-1,  -1, 1,-1, 
            -1,-1, 1,    1,-1,-1,   1, 1, 1,
            -1, 1,-1,    1,-1,-1,  -1,-1, 1,
        ])
        return this
    },

    sphere: function() {
        const v = [], w = []

        for (let lat = 0; lat <= geoSpherePrecision; lat++) {
            let theta = (lat * PI) / geoSpherePrecision,
                cost = cos(theta),
                sint = sin(theta)

            for (let lon = 0; lon < geoSpherePrecision; lon++) {
                let phi = (lon * PI2) / geoSpherePrecision,
                    cosp = cos(phi),
                    sinp = sin(phi)
                    v.push(
                        cosp * sint,  // x
                        cost,         // y
                        sinp * sint   // z
                    )
            }
        }

        for (let lat = 0; lat < geoSpherePrecision; lat++) {
            for (let lon = 0; lon < geoSpherePrecision; lon++) {
                
                let base = lat * geoSpherePrecision
                    base2 = ((lat + 1)) * geoSpherePrecision
                    nextLon = (lon + 1) % geoSpherePrecision
                    at = (base + lon) * 3,
                    at2 = (base + nextLon) * 3
                    at3 = (base2 + lon) * 3
                    at4 = (base2 + nextLon) * 3

                w.push(
                    v[at], v[at+1], v[at+2],
                    v[at2], v[at2+1], v[at2+2],
                    v[at3], v[at3+1], v[at3+2],

                    v[at2], v[at2+1], v[at2+2],
                    v[at4], v[at4+1], v[at4+2],
                    v[at3], v[at3+1], v[at3+2],
                )
            }
        }

        geo.vertices = geo.vertices.concat(w)
        return this
    },

    cylinder() {
        const v = [], w = []

        for (let lon = 0; lon < geoSpherePrecision; lon++) {
            let phi = (lon * PI2) / geoSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < geoSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % geoSpherePrecision) * 3

                w.push(
                    v[at],   1,  v[at+2],
                    v[at2],  1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at2],  1,  v[at2+2],
                    v[at2], -1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at],   1,  v[at+2],
                    0,       1,  0,
                    v[at2],  1,  v[at2+2],

                    v[at2], -1,  v[at2+2],
                    0,      -1,  0,
                    v[at],  -1,  v[at+2]
                )
        }

        geo.vertices = geo.vertices.concat(w)
        return this
    },
    
    cone() {
        const v = [], w = []

        for (let lon = 0; lon < geoSpherePrecision; lon++) {
            let phi = (lon * PI2) / geoSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < geoSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % geoSpherePrecision) * 3

                w.push(
                    0,  1,  0,
                    v[at2], -1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at2], -1,  v[at2+2],
                    0,      -1,  0,
                    v[at],  -1,  v[at+2]
                )
        }

        geo.vertices = geo.vertices.concat(w)
        return this
    },

    circle: function() {
        const v = [], w = []

        for (let lon = 0; lon < geoSpherePrecision; lon++) {
            let phi = (lon * PI2) / geoSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < geoSpherePrecision; lon++) {
                let at = lon * 3,
                    at2 = ((lon + 1) % geoSpherePrecision) * 3

                w.push(
                    v[at2], 0,  v[at2+2],
                    0,      0,  0,
                    v[at],  0,  v[at+2]
                )
        }

        geo.vertices = geo.vertices.concat(w)
        return this
    },
    
    ring() {
        const ir = pop(), v = [], w = []

        for (let lon = 0; lon < geoSpherePrecision; lon++) {
            let phi = (lon * PI2) / geoSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < geoSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % geoSpherePrecision) * 3

                w.push(
                    v[at2],    0,  v[at2+2],
                    v[at],     0,  v[at+2], 
                    v[at2]*ir, 0,  v[at2+2]*ir,

                    v[at],     0,  v[at+2],
                    v[at]*ir,  0,  v[at+2]*ir,
                    v[at2]*ir, 0,  v[at2+2]*ir

                    /*
                    v[at]*ir,  0,  v[at]*ir,
                    v[at],     0,  v[at],
                    v[at2]*ir, 0,  v[at2]*ir,

                    v[at2]*ir, 0,  v[at2]*ir,
                    v[at],     0,  v[at],
                    v[at2],    0,  v[at2]
                    */
                )
        }

        geo.vertices = geo.vertices.concat(w)
        return this
    },

    mid: function() {
        geoMatrix = mat4.identity()
        return this
    },

    mscale: function() {
        mat4.scale(geoMatrix, popV3())
        return this
    },

    mtranslate: function() {
        mat4.translate(geoMatrix, popV3())
        return this
    },

    mrotX: function() {
        mat4.rotX(geoMatrix, pop())
        return this
    },

    mrotY: function() {
        mat4.rotY(geoMatrix, pop())
        return this
    },

    mrotZ: function() {
        mat.rotZ(geoMatrix, pop())
        return this
    },

    reflectX: function() {
        v3Clone((x, y, z) => vec3(-x, y, z))
    },

    reflectY: function() {
        v3Clone((x, y, z) => vec3(x, -y, z))
    },

    reflectZ: function() {
        v3Clone((x, y, z) => vec3(x, y, -z))
    },

    // scale the existing geometry
    scale: function() {
        const s = pop()
        vxApply(n => n * s)
        return this
    },

    stretchX: function() {
        const s = pop()
        vxApply((n, i) => (i % 3) == 0? n * s : n)
        return this
    },

    stretchY: function() {
        const s = pop()
        vxApply((n, i) => i % 3 == 1? n * s : n)
        return this
    },

    stretchZ: function() {
        const s = pop()
        vxApply((n, i) => i % 3 == 2? n * s : n)
        return this
    },

    label: function(n) {
        geo.name = n || pop()
        return this
    },

    brew: function() {
        // normalize
        geo.vertices = new Float32Array(geo.vertices)
        geo.vertCount = geo.vertices.length / 3

        // wireframe points
        geo.wires = []
        for (let i = 0; i < geo.vertices.length; i += 9) {
            let v1 = vec3.fromArray(geo.vertices, i),
                v2 = vec3.fromArray(geo.vertices, i+3),
                v3 = vec3.fromArray(geo.vertices, i+6)

            geo.wires.push(...v1)
            geo.wires.push(...v2)
            geo.wires.push(...v2)
            geo.wires.push(...v3)
            geo.wires.push(...v3)
            geo.wires.push(...v1)
        }
        geo.wires = new Float32Array(geo.wires)

        if (geo.uvs && geo.uvs.length > 0) {
            geo.uvs = new Float32Array(geo.uvs)
        } else {
            geo.uvs = null
        }

        if (geo.colors && geo.colors.length > 0) {
            geo.colors = new Float32Array(geo.colors)
        } else {
            geo.colors = null
        }

        if (!geo.faces || geo.faces.length === 0) {
            geo.faces = null
        } else {
            geo.faces = new Uint16Array(geo.faces)
            geo.facesCount = geo.faces.length
        }

        if (!geo.normals || geo.normals.length === 0) {
            geo.autocalcNormals = true
            geo.normals = new Float32Array( lib.gluten.calcNormals(geo.vertices, flags.smooth) ) 
        } else {
            geo.normals = new Float32Array(geo.normals) 
        }

        // DEBUG vertex stat
        if (env.debug) {
            if (!this._vertexCount) this._vertexCount = 0
            this._vertexCount += geo.vertCount

            if (!this._polygonCount) this._polygonCount = 0
            this._polygonCount += geo.vertCount / 3

            if (!this._geoCount) this._geoCount = 0
            this._geoCount ++

            env.dump['Geometry Library'] = `${this._geoCount} (${this._polygonCount} polygons)`
        }

        // lib.geo.cur = geo // TODO do we have any reasone to preserve that as current in the lib?
        lib.geoLibrary.attachMesh(geo)
        return this
    },

    bake: function() {
        this.brew()
        return geo
    },

    last: function() {
        return geo
    },

    next: function(g) {
        geo = g
        return this
    },

    bakeWires: function() {
        geo.wires = new Float32Array(geo.vertices)
        geo.wires.vertCount = geo.vertices.length / 3
        delete geo.vertices
        return geo
    },

    dump: function() {
        const b = []

        b.push('=== matrix ===\n')
        geoMatrix.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 4 === 3) b.push('\n')
        })


        b.push('\n=== stack ===\n')
        stack.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 3 === 2) b.push('\n')
        })

        console.dir(stack)
        console.dir(geoMatrix)
        const d = b.join('')
        console.log(d)
        term.println('\n' + d)
    },

    dumpv: function() {
        const b = []

        b.push('\n=== verteces ===\n')
        geo.vertices.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 9 === 8) b.push('\n')
            else if (i % 3 === 2) b.push('    ')
        })

        const d = b.join('')
        console.dir(geo.vertices)
        console.log(d)
        term.println('\n' + d)
    },
}
return $

})()
