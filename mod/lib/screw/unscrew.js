// CorkScrew virtual machine
// 
// Receives screw opcodes as the input and produces
// geometry and auxiliary data as the output.
//
// TODO how to add a new VM instruction?
//
// TODO must be called screwdriver

// === geo library ===
// Accumulates all meshes and materials parsed in this session
let library

const unscrew = (() => {

// === geometry state ===
let g,                      // current geo form
    x, y, z, w,             // working registers

    M = mat4.identity(),    // current geo model matrix, TODO - move to new mat4
    P = 13,                 // current precision qualifier
    _smooth = false         // smooth flag, sharp if not set

let s = [], m = [], b = [] // value and matrix stacks

function pop() {
    //if (debug) if (s.length === 0) throw 'Empty stack!'
    return s.pop()
}

function peek() {
    return s[s.length - 1]
}

function popV4() {
    w = pop()
    z = pop()
    y = pop()
    x = pop()
    return vec4(x, y, z, w)
}

// apply a function for each vertice value of current geometry
function vxApply(fn) {
    for (let i = 0; i < g.vertices.length; i++) {
        g.vertices[i] = fn(g.vertices[i], i)
    }
}

// apply the function to x/y/z vertex tripplets of current geometry
function v3c(fn) {
    let swap = true, bv, ln = g.vertices.length
    for (let i = 0; i < ln; i += 3) {
        const x = g.vertices[i], y = g.vertices[i+1], z = g.vertices[i+2]
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

function filterTri(fn) {
    const ls = g.vertices,
          N  = ls.length,
          nl = []
    for (let i = 0; i < N; i += 9) {
        const pass = fn( 
            ls[i  ], ls[i+1], ls[i+2],
            ls[i+3], ls[i+4], ls[i+5],
            ls[i+6], ls[i+7], ls[i+8]
        )
        if (pass) {
            nl.push( ls[i  ] )
            nl.push( ls[i+1] )
            nl.push( ls[i+2] )

            nl.push( ls[i+3] )
            nl.push( ls[i+4] )
            nl.push( ls[i+5] )

            nl.push( ls[i+6] )
            nl.push( ls[i+7] )
            nl.push( ls[i+8] )
        }
    }
    g.vertices = nl
}

// apply current model matrix to provided array and push values
function wM(w) {
    for (let i = 0; i < w.length; i += 3) {
        v3x( vec3(w[i], w[i+1], w[i+2]) )
    }
}

// apply the geo matrix to vec3 and push the results to vertices
function v3x(v) {
    // vec3.mulM4(v, M)
    vec3.applyMat4(v, v, M)
    g.vertices.push(v[0])
    g.vertices.push(v[1])
    g.vertices.push(v[2])
}

// merge x/y/z into a vec3, apply the geo matrix and push the results to vertices
function vx(x, y, z) {
    const v = vec3(x, y, z)
    // vec3.mulM4(v, M)
    vec3.applyMat4(v, v, M)
    g.vertices.push(v[0])
    g.vertices.push(v[1])
    g.vertices.push(v[2])
}

/*
// append the array of vertices to the current mesh through the current modeling matrix
function wx(w) {
    for (let i = 0; i < w.length; i += 3) {
        const v = vec3(w[i], w[i+1], w[i+2])
        vec3.applyMat4(v, v, M)
        g.vertices.push(v[0])
        g.vertices.push(v[1])
        g.vertices.push(v[2])
    }
}
*/

// apply geo transformations to nx before pushing in
function nx(x, y, z) {
    const v = vec3(x, y, z)
    // vec3.mulM4(v, M)
    vec3.applyMat4(v, v, M)
    g.normals.push(v[0])
    g.normals.push(v[1])
    g.normals.push(v[2])
}

// pop vec3 from the stack
function pv3() {
    z = pop(), y = pop(), x = pop()
    return vec3(x, y, z)
}

function dumpVM() {
    log('=== VM DUMP ===')
    dir(g)
    log(`regs -- x:${x}, y:${y}, z:${z}, w:${w}`)
    log('current model matrix:')
    dir(M)
    log('stack:')
    log(s)
}

const ops = [
    function neogeo() {
        g = {
            vertices: [],
            normals: [],
            // faces: [],
            colors: [],
            uvs: [],
            BUFFERS: ['vertices', 'normals', 'wires', 'colors', 'uvs'],
        }
    },
    function drop() { pop() },
    function swap() {
        x = pop(), y = pop()
        s.push(x)
        s.push(y)
    },
    function dup() {
        s.push( s[ s.length-1 ] )
    },
    function over() {
        s.push( s[ s.length-2 ] )
    },
    function mpush() { m.push( mat4.clone(M) ) },
    function mpop() { M = m.pop() },
    // cache current geometry in the buffer
    function buf() {
        b = g.vertices
        g.vertices = []
    },
    function unbuf() {
        wM(b)
    },
    function place() {
        x = pop()
        const mesh = library.mesh._dir[x]
        if (!mesh) throw new Error(`can't find mesh [${x}]!`)
        wM(mesh.vertices)
    },
    // HPI (Half PI) - push half PI
    function PI()  { s.push( Math.PI ) },
    function HPI() { s.push( .5 * Math.PI ) },
    function TAU() { s.push(  2 * Math.PI ) },
    function add() { s.push( pop() + pop() ) },
    function sub() {
        x = pop()
        s.push( pop() - x )
    },
    function mul() {
        s.push( pop() * pop() )
    },
    function div() {
        const x = pop()
        s.push( pop() / x )
    },
    function sin() {
        s.push( Math.sin( pop() ) )
    },
    function cos() {
        s.push( Math.cos( pop() ) )
    },
    function tan() {
        s.push( Math.tan( pop() ) )
    },
    function asin() {
        s.push( Math.asin( pop() ) )
    },
    function acos() {
        s.push( Math.acos( pop() ) )
    },
    function atan() {
        s.push( Math.atan( pop() ) )
    },
    function atan2() {
        const x = pop(), y = pop()
        s.push( Math.atan2(y, x) )
    },
    function precision() { P = pop() },
    function smooth() { _smooth = true  },
    function sharp() { _smooth = false },

    // === modifiers ===
    // mid - set identity matrix
    function mid() { M = mat4.identity() },
    function mscale() { mat4.scale(M, pv3()) },
    function translate() { mat4.translate(M, pv3()) },
    function mrotX() { mat4.rotX(M, pop()) },
    function mrotY() { mat4.rotY(M, pop()) },
    function mrotZ() { mat4.rotZ(M, pop()) },
    function reflectX() {
        v3c((x, y, z) => vec3(-x, y, z))
    },
    function reflectY() {
        v3c((x, y, z) => vec3(x, -y, z))
    },
    function reflectZ() {
        v3c((x, y, z) => vec3(x, y, -z))
    },
    function scale() {
        x = pop()
        vxApply(n => n * x)
    },
    function stretch() {
        z = pop()
        y = pop()
        x = pop()
        vxApply((n, i) => i % 3 == 2? n * z : n)
        vxApply((n, i) => i % 3 == 1? n * y : n)
        vxApply((n, i) => (i % 3) == 0? n * x : n)
    },
    function discardNegativeX() {
        filterTri((x1, y1, z1,  x2, y2, z2,  x3, y3, z3) => {
            return (x1 >= 0 && x2 >= 0 && x3 >= 0)
        })
    },
    function discardNegativeY() {
        filterTri((x1, y1, z1,  x2, y2, z2,  x3, y3, z3) => {
            return (y1 >= 0 && y2 >= 0 && y3 >= 0)
        })
    },
    function discardNegativeZ() {
        filterTri((x1, y1, z1,  x2, y2, z2,  x3, y3, z3) => {
            return (z1 >= 0 && z2 >= 0 && z3 >= 0)
        })
    },

    // geometry assemblers
    // tri - define a triangle vertex set
    function tri() {
        for (let i = 0; i < 9; i += 3) {
            z = pop(), y = pop(), x = pop()
            vx(x, y, z)
        }
    },
    // tuv - define a uv coordinates set for the triangle
    function tuv() {
        for (let i = 0; i < 6; i += 2) {
            y = pop()
            g.uvs.push( pop() )
            g.uvs.push(y)
        }
    },
    // mt - define the suggested material
    function mt() {
        let N, t = 0
        if (typeof peek() === 'string') {
            N = pop()
            t = 1
        }
        w = {
            n: pop(),
            s: popV4(),
            d: popV4(),
            a: popV4(),
        }
        // define in global space or as a local geometry material
        t? library.attachMaterial(w) : g.m = w
    },

    // === basic geometries ===
    function quad() {
        wM([
            -1, 0,-1,  1, 0, 1,  1, 0,-1,    
            -1, 0,-1, -1, 0, 1,  1, 0, 1
        ])
    },

    // === complex geometries ===
    function cube() {
        w = [
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
        ]
        wM(w)

        /*
        // TODO handle the UV flag
        if (_gUV) {
            g.uvs = g.uvs.concat([
                1, 0,   1, 1,   0, 1,
                1, 0,   0, 1,   0, 0,
            ])
            // apply UVs for each face
            for (let j = 0; j < 12; j++) {
                for (let i = 0; i < 12; i++) {
                    g.uvs.push(g.uvs[i])
                }
            }
        }
        */
    },
    function sphere() {
        const v = [], w = []

        for (let lat = 0; lat <= P; lat++) {
            let theta = (lat * PI) / P,
                cost = cos(theta),
                sint = sin(theta)

            for (let lon = 0; lon < P; lon++) {
                let phi = (lon * PI2) / P,
                    cosp = cos(phi),
                    sinp = sin(phi)
                    v.push(
                        cosp * sint,  // x
                        cost,         // y
                        sinp * sint   // z
                    )
            }
        }

        for (let lat = 0; lat < P; lat++) {
            for (let lon = 0; lon < P; lon++) {
                
                let base = lat * P,
                    base2 = ((lat + 1)) * P,
                    nextLon = (lon + 1) % P,
                    at = (base + lon) * 3,
                    at2 = (base + nextLon) * 3,
                    at3 = (base2 + lon) * 3,
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
        wM(w)
    },
    function circle() {
        const v = [], w = []

        for (let lon = 0; lon < P; lon++) {
            let phi = (lon * PI2) / P,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < P; lon++) {
                let at = lon * 3,
                    at2 = ((lon + 1) % P) * 3

                w.push(
                    v[at2], 0,  v[at2+2],
                    0,      0,  0,
                    v[at],  0,  v[at+2]
                )
        }
        wM(w)
    },
    function tube() {
        const v = [], w = []

        for (let lon = 0; lon < P; lon++) {
            let phi = (lon * PI2) / P,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < P; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % P) * 3

                w.push(
                    v[at],   1,  v[at+2],
                    v[at2],  1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at2],  1,  v[at2+2],
                    v[at2], -1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    /*
                    v[at],   1,  v[at+2],
                    0,       1,  0,
                    v[at2],  1,  v[at2+2],

                    v[at2], -1,  v[at2+2],
                    0,      -1,  0,
                    v[at],  -1,  v[at+2]
                    */
                )
        }
        wM(w)
    },
    function cylinder() {
        const v = [], w = []

        for (let lon = 0; lon < P; lon++) {
            let phi = (lon * PI2) / P,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < P; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % P) * 3

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
        wM(w)
    },

    // === finalizer ===
    function bounds() { g.bounds = pv3() },
    // define data array
    function dat() {
        y = 0
        if (typeof peek() === 'string') {
            x = pop()
            y = 1
        }
        w = [].concat(s)
        if (y) w.name = x
        library.attachData(w)
        s = []
    },
    function name() { g.name = pop() },
    function tag()  {
        if (!g.tag) g.tag = {}
        g.tag[ pop() ] = true
    },
    function brew() {
        // normalize
        g.vertices = new Float32Array(g.vertices)
        g.vc = g.vertices.length / 3

        // DEBUG - generate wireframe points
        // wireframe points
        g.wires = []
        for (let i = 0; i < g.vertices.length; i += 9) {
            let v1 = vec3.fromArray(g.vertices, i),
                v2 = vec3.fromArray(g.vertices, i+3),
                v3 = vec3.fromArray(g.vertices, i+6)
            //vec3.push(g.w, v1).push(g.w, v2)
            //    .push(g.w, v2).push(g.w, v3)
            //    .push(g.w, v3).push(g.w, v1)
            // vec3.push(g.w, v1)
            // vec3.push(g.w, v2)
            // vec3.push(g.w, v2)
            // vec3.push(g.w, v3)
            // vec3.push(g.w, v3)
            // vec3.push(g.w, v1)
            g.wires.push(...v1)
            g.wires.push(...v2)
            g.wires.push(...v2)
            g.wires.push(...v3)
            g.wires.push(...v3)
            g.wires.push(...v1)
        }
        g.wires = new Float32Array(g.wires)

        if (g.uvs.length > 0) g.uvs = new Float32Array(g.uvs)
        else g.uvs = null

        if (g.colors.length > 0) g.colors = new Float32Array(g.colors)
        else g.colors = null

        /*
        if (g.f.length === 0) {
            g.f = null
        } else {
            g.f = new Uint16Array(g.f)
            g.fc = g.f.length
        }
        */

        if (g.normals.length === 0) {
            g.normals = new Float32Array( lib.gluten.calcNormals(g.vertices, _smooth) ) 
        } else {
            g.normals = new Float32Array(g.normals) 
        }

        // DEBUG vertex stat
        if (env.debug) {
            if (!this.vc) this.vc = 0
            this.vc += g.vc

            if (!this.pc) this.pc = 0
            this.pc += g.vc / 3

            if (!this.gc) this.gc = 0
            this.gc ++

            env.dump['Geometry Library'] = `${this.gc} (${this.pc} polygons)`
        }

        library.attachMesh(g)
        brews.push(g)
    },
    // brewWires
    function brewWires() {
        g.w = new Float32Array(g.vertices)
        g.w.vc = g.vertices.length / 3
        delete g.vertices
    },

    function dump() {
        dumpVM()
    },

    function halt() {
        dumpVM()
        debugger
    },
]
const action = {}
ops.forEach(op => action[op.name] = op)

// === SCREW VM ===
let def = {}, cdef, brews = []

// emu modes
const
      EMOD = 0,
      DMOD = 1

function unscrewRune(r) {
    let n = r.charCodeAt(0)
    //if (debug) if (n > 196) throw `Corrupted rune: [${r}]`
    if (n > 96) n--
    if (n > 92) n--
    return n - 32
}

function unscrewOpcodes(rawcodes) {
    const opcodes = rawcodes.map(r => unscrewRune(r))
    opcodes.raw = rawcodes
    return opcodes
}

/*
// HOWTO introduce a new op
//       * include the operator function into the ops array in unscrew (future screwdriver)
//       * insert the op name in the ops.ref manifest at the matching position (== ops array index) => must be indexed automatically
//
//       * don't forget to recompile existing snapshots with ./compile-s! (only for js13k?)
*/

/*
const PUSHS = 39,
      DEF   = PUSHS + 1,
      END   = PUSHS + 2,
      CALL  = PUSHS + 3,
      PUSHV = PUSHS + 4
*/

function exec(opcodes) {
    const lops = lib.screw.ops,
          SPECIAL  = lops.SPECIAL,
          PUSH_VVV = lops.PUSH_VVV,
          PUSHS    = lops.PUSHS,
          DEF      = lops.DEF,
          END      = lops.END,
          CALL     = lops.CALL

    const LEN = opcodes.length
    let op, i = 0, n, buf
    // DEBUG vm
    try {
        while (i < LEN) {
            op = opcodes[i++]

            if (cdef) {
                // in definition mode
                if (op === END) {
                    // definition is done
                    console.log('#' + (def.length-1) + ' - NEW WORD IS DEFINED!')
                    console.dir(cdef)
                    console.log(cdef.map(op => op + '/' + lib.screw.ops.ref[op]).join(' '))
                    cdef = null
                } else {
                    cdef.push(op)
                    cdef.raw.push(opcodes.raw[i-1])
                }
            } else {

                if (env.config.debugUnscrew) {
                    switch(op) {
                        case PUSHS:    log('^pushs');   break;
                        case DEF:      log('^def');     break;
                        case END:      log('^end');     break;
                        case CALL:     log('^call');    break;

                        default:
                            if (op >= PUSH_VVV + 16) {
                                log('^unscrewing a sequence?')
                            } else if (op >= PUSH_VVV) {
                                log('^unscrewing a number???')
                            } else {
                                log(`^!${ops[op].name}()`)
                            }
                    }
                }

                switch(op) {
                    case PUSHS:
                        buf = []
                        n = opcodes[i++]
                        for (let j = 0; j < n; j++) buf.push(opcodes.raw[i++])
                        s.push(buf.join(''))
                        break

                    case DEF:
                        cdef = []
                        cdef.raw = []
                        def.push(cdef)
                        break

                    case CALL:
                        x = pop()
                        // DEBUG calls
                        // console.log('calling #' + x)
                        exec( def[x] )
                        break

                    /*
                    // TODO is it needed at all?
                    case PUSH_VVV:
                        s.push(unscrewNumber(opcodes[i++]))
                        break
                    */

                    default:
                        if (op >= PUSH_VVV + 16) {
                            let o = op - PUSH_VVV - 16,
                                x = floor(o / 4) + 1,
                                t = o % 4,
                                c = 93 ** x,
                                l = opcodes[i++], n, k, j

                            if (env.config.debugUnscrew) {
                                console.log(`[!] unscrewing a sequence t:${t}/x:${x} of ${l} elements`)
                            }
                            for (k = 0; k < l; k++) {
                                n = opcodes[i++]
                                for (j = 1; j < x; j++) {
                                    n = n + (93 ** j) * opcodes[i++]
                                }
                                if (n >= floor(c/2)) n -= c
                                s.push(n / (10**t))
                                // DEBUG number parsing
                                if (env.config.debugUnscrew) {
                                    console.log(`#${k}: ${n/(10**t)}`)
                                }
                            }

                        } else if (op >= PUSH_VVV) {
                            let o = op - PUSH_VVV,
                                x = floor(o / 4) + 1,
                                t = o % 4,
                                c = 93 ** x

                            let n = opcodes[i++]
                            for (let j = 1; j < x; j++) {
                                n = n + (93 ** j) * opcodes[i++]
                            }
                            if (n >= floor(c/2)) n -= c
                            s.push(n / (10**t))
                            //if (n > 41) n -= 92
                            //return n/10
                                
                        } else {
                            // DEBUG vm ops
                            //if (debug) {
                            //    const fn = ops[op]
                            //    if (!fn) throw `no function for op [${op}] - [${ref[op]}]`
                            //}
                            if (!isFun(ops[op])) {
                                dumpVM()
                                throw new Error(`Can't find opcode implementation: ${op}`)
                            }
                            ops[op]()
                            s.forEach(e => {
                                if (typeof e === 'number' && isNaN(e)) {
                                    log('op #' + op)
                                    dir(ops[op])
                                    dumpVM()
                                    debugger
                                }
                            })
                        }
                }
            }
        }
    } catch(e) {
        // DEBUG vm
        log(`[!!!] ERROR @${i-1}: #${op}/${lib.screw.ops.ref[op]}`)
        log(opcodes.raw.join(''))
        console.dir(opcodes)
        log(opcodes.map(op => lib.screw.ops.ref[op]).join('\n'))
        console.log('definitions:')
        console.dir(def)
        throw e
    }
    return brews
}

function resetEmuState() {
    s     = []
    def   = []
    brews = []
    action.mid()
}

function unscrew(runes, continuation) {
    // if (debug) log(`unscrewing:[${runes}](${runes.length})`)
    if (!continuation) resetEmuState()
    return exec( unscrewOpcodes( runes.split('') ) )
}

function getLibrary() {
    return geo
}

function setLibrary(l) {
    library = l
}

if (env.config.debug) {

    function unscrewOne(runes) {
        return unscrew(runes).pop()
    }

    extend(unscrew, {
        getLibrary,
        setLibrary,

        unscrewOne,
        ops,
        cg: () => g,
        cM: () => M,
        cs: () => s,
        reset: () => {
            M = mat4.identity(),    // current geo model matrix
            // clean stacks
            s = []
            m = []
        },
    })
    return unscrew

} else {
    extend(unscrew, {
        getLibrary,
        setLibrary,
    })
    return unscrew
}
// return unscrew

})()
