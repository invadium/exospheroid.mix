// Interface for 4D Vector Operations

// create a new vec4 initialized by provided x,y,z,w values
//
// @param {number/optional} x
// @param {number/optional} y
// @param {number/optional} z
// @param {number/optional} w
// @returns {Float32Array} a new vec4 array
function create(x, y, z, w) {
    const nv = new Float32Array(4)

    nv[0] = x ?? 0
    nv[1] = y ?? 0
    nv[2] = z ?? 0
    nv[3] = w ?? 1

    return nv
}

// create and register a new 4D vector array
//
// @param {number/optional} x
// @param {number/optional} y
// @param {number/optional} z
// @param {number/optional} w
// @param {array/vec2} rv - the receiving 2D vector array
function xcreate(x, y, z, w) {
    const nv = new Float32Array(4)

    nv[0] = x ?? 0
    nv[1] = y ?? 0
    nv[2] = z ?? 0
    nv[3] = w ?? 1
    this.rx = nv

    return this
}

// set values of a vec4 array components to zero
//
// @param {array/vec4} rv - a receiving vec4 array
// @returns {obj/lib/vec4} vec4 library object for chaining
function zero(rv) {
    rv[0] = 0
    rv[1] = 0
    rv[2] = 0
    rv[3] = 0

    return this
}

// create and return new zero-filled vec4 array
//
// @returns {Float32Array} a new vec4 array with 0 values
function izero() {
    return new Float32Array(4)
}

// set a unit vector for the specified angles
//
// @param {array/vec4} vout - a receiving vec4 array
// @param {number/angle} theta - polar axis (to zenith) angle in radians
// @param {number/angle} kappa - 4D polar axis angle in radians
// @param {number/angle} phi - azimuth angle in radians
// @returns {obj/lib/vec4} vec4 library object for chaining
function unit(rv, theta, kappa, phi) {
    rv[0] = sin(theta) * sin(kappa) * cos(phi)
    rv[1] = sin(theta) * sin(kappa) * sin(phi)
    rv[2] = sin(theta) * cos(kappa)
    rv[3] = cos(theta)

    return this
}

// create a unit vector from the specified angles
//
// @param {number/angle} theta - polar axis (to zenith) angle in radians
// @param {number/angle} kappa - 4D polar axis angle in radians
// @param {number/angle} phi - azimuth angle in radians
// @returns {Float32Array} a new 4D unit vector
function iunit(theta, kappa, phi) {
    const nv = new Float32Array(4)

    nv[0] = sin(theta) * sin(kappa) * cos(phi)
    nv[1] = sin(theta) * sin(kappa) * sin(phi)
    nv[2] = sin(theta) * cos(kappa)
    nv[3] = cos(theta)

    return nv
}

// clone a source vec4 array to a new one
//
// @param {array/vec4} iv - a source 4D vector
// @returns {array/vec4} the cloned 4D vector
function clone(iv) {
    const nv = new Float32Array(4)

    nv[0] = iv[0]
    nv[1] = iv[1]
    nv[2] = iv[2]
    nv[3] = iv[3]

    return nv
}

// copy a source vec4 array to the target one
//
// @param {array/vec4} rv - a receiving 4D vector array
// @param {array/vec4} iv - a source 4D vector array
// @returns {obj/lib/vec4} vec4 library object for chaining
function copy(rv, iv) {
    rv[0] = iv[0] ?? rv[0]
    rv[1] = iv[1] ?? rv[1]
    rv[2] = iv[2] ?? rv[2]
    rv[3] = iv[3] ?? rv[3]

    return this
}

// set the components of a vec4 array
//
// @param {array/vec4} rv - a receiving 4D vector array
// @param {number} x - 4D vector x component
// @param {number} y - 4D vector y component
// @param {number} z - 4D vector z component
// @param {number} w - 4D vector w component
// @returns {obj/lib/vec4} vec4 library object for chaining
function set(rv, x, y, z, w) {
    rv[0] = x ?? rv[0]
    rv[1] = y ?? rv[1]
    rv[2] = z ?? rv[2]
    rv[3] = w ?? rv[3]
    return this
}

// add two vec4 arrays
//
// @param {array/vec4} rv - a receiving 4D vector array
// @param {array/vec4} iv1 - the first 4D vector (immutable)
// @param {array/vec4} iv2 - the second 4D vector (immutable)
// @returns {obj/lib/vec4} vec4 library object for chaining
function add(rv, iv1, iv2) {
    rv[0] = iv1[0] + iv2[0]
    rv[1] = iv1[1] + iv2[1]
    rv[2] = iv1[2] + iv2[2]
    rv[3] = iv1[3] + iv2[3]
    return this
}

// add two vec4 into a newly created vec4 array
//
// @param {array/vec4} iv1 - the first 4D vector
// @param {array/vec4} iv2 - the second 4D vector
// @returns {array/vec4} the created output 4D vector
function iadd(iv1, iv2) {
    const vout = new Float32Array(4)
    vout[0] = iv1[0] + iv2[0]
    vout[1] = iv1[1] + iv2[1]
    vout[2] = iv1[2] + iv2[2]
    vout[3] = iv1[3] + iv2[3]
    return vout
}

// add vec4 array and x/y/z/w components of a 4D vector
//
// @param {array/vec4} outv - the receiving 4D vector
// @param {array/vec4} iv - the source 4D vector
// @param {number} x
// @param {number} y
// @param {number} z
// @param {number} w
// @returns {obj/lib/vec4} vec4 library object for chaining
function cadd(outv, iv, x, y, z, w) {
    outv[0] = iv[0] + x
    outv[1] = iv[1] + y
    outv[2] = iv[2] + z
    outv[3] = iv[3] + w
    return this
}

// subtract 4D vector iv2 from 4D vector iv1
//
// @param {array/vec4} rv   - the receiving 4D vector
// @param {array/vec4} iv1  - the first 4D vector operand
// @param {array/vec4} iv2  - the second 4D vector operand
// @returns {obj/lib/vec4} vec4 library object for chaining
function sub(rv, iv1, iv2) {
    rv[0] = iv1[0] - iv2[0]
    rv[1] = iv1[1] - iv2[1]
    rv[2] = iv1[2] - iv2[2]
    rv[3] = iv1[3] - iv2[3]
    return this
}

// subtract the second 4D vector from the first into a newly created 4D vector array
//
// @param {array/vec4} iv1 - the first 4D vector
// @param {array/vec4} iv2 - the second 4D vector
// @returns {array/vec4} the created output 4D vector
function isub(iv1, iv2) {
    const nv = new Float32Array(4)
    nv[0] = iv1[0] - iv2[0]
    nv[1] = iv1[1] - iv2[1]
    nv[2] = iv1[2] - iv2[2]
    nv[3] = iv1[3] - iv2[3]
    return nv
}

// subtract components of a 4D vector from a 4D vector array
//
// @param {array/vec4} rv - the receiving 4D vector
// @param {array/vec4} iv - the source 4D vector
// @param {number} x
// @param {number} y
// @param {number} z
// @param {number} w
// @returns {obj/lib/vec4} vec4 library object for chaining
function csub(rv, iv, x, y, z, w) {
    rv[0] = iv[0] - x
    rv[1] = iv[1] - y
    rv[2] = iv[2] - z
    rv[3] = iv[3] - w
    return this
}

// multiply 4D vectors iv1 and iv2 into an output 4D vector array
//
// @param {array/vec4} rv  - the receiving 4D vector
// @param {array/vec4} iv1 - the first 4D vector operand
// @param {array/vec4} iv2 - the second 4D vector operand
// @returns {obj/lib/vec4} vec4 library object for chaining
function mul(rv, iv1, iv2) {
    rv[0] = iv1[0] * iv2[0]
    rv[1] = iv1[1] * iv2[1]
    rv[2] = iv1[2] * iv2[2]
    rv[3] = iv1[3] * iv2[3]
    return this
}

// multiply two 4D vectors into the newly created 4D vector array
//
// @param {array/vec4} iv1 - the first 4D vector
// @param {array/vec4} iv2 - the second 4D vector
// @returns {array/vec4} the created output 4D vector
function imul(iv1, iv2) {
    const nv = new Float32Array(4)
    nv[0] = iv1[0] * iv2[0]
    nv[1] = iv1[1] * iv2[1]
    nv[2] = iv1[2] * iv2[2]
    nv[3] = iv1[3] * iv2[3]
    return nv
}

// multiply a 4D vector with provided 4D vector components
//
// @param {array/vec4} rv - the receiving 4D vector
// @param {array/vec4} iv - the source 4D vector
// @param {number} x
// @param {number} y
// @param {number} z
// @param {number} w
// @returns {obj/lib/vec4} vec4 library object for chaining
function cmul(rv, iv, x, y, z, w) {
    rv[0] = iv[0] * x
    rv[1] = iv[1] * y
    rv[2] = iv[2] * z
    rv[3] = iv[3] * w
    return this
}

// divide 4D vectors iv1 and iv2 into an output 4D vector array
//
// @param {array/vec4} rv  - the receiving 4D vector
// @param {array/vec4} iv1 - the first 4D vector operand
// @param {array/vec4} iv2 - the second 4D vector operand
// @returns {obj/lib/vec4} vec4 library object for chaining
function div(rv, iv1, iv2) {
    rv[0] = iv1[0] / iv2[0]
    rv[1] = iv1[1] / iv2[1]
    rv[2] = iv1[2] / iv2[2]
    rv[3] = iv1[3] / iv2[3]
    return this
}

// divide two 4D vectors into the newly created 4D vector array
//
// @param {array/vec4} iv1 - the first 4D vector
// @param {array/vec4} iv2 - the second 4D vector
// @returns {array/vec4} the created output 4D vector
function idiv(iv1, iv2) {
    const nv = new Float32Array(4)
    nv[0] = iv1[0] / iv2[0]
    nv[1] = iv1[1] / iv2[1]
    nv[2] = iv1[2] / iv2[2]
    nv[3] = iv1[3] / iv2[3]
    return nv
}

// divide a 4D vector by provided 4D vector components
//
// @param {array/vec4} rv - the receiving 4D vector
// @param {array/vec4} iv - the source 4D vector
// @param {number} x
// @param {number} y
// @param {number} z
// @param {number} w
// @returns {obj/lib/vec4} vec4 library object for chaining
function cdiv(rv, iv, x, y, z, w) {
    rv[0] = iv[0] / x
    rv[1] = iv[1] / y
    rv[2] = iv[2] / z
    rv[3] = iv[3] / w
    return this
}

// dot product of two 4D vectors
//
// @param {array/vec4} iv1 - the first 4D vector operand
// @param {array/vec4} iv2 - the second 4D vector operand
// @returns {number} the dot product of two 4D vectors
function dot(iv1, iv2) {
    return (iv1[0] * iv2[0]  +  iv1[1] * iv2[1]  +  iv1[2] * iv2[2]  +  iv1[3] * iv2[3])
}

// dot product between the source 4D vector and the components of another 4D vector
//
// @param {array/vec4} iv1 - the first 4D vector operand
// @param {number} x - the second 4D vector x component
// @param {number} y - the second 4D vector y component
// @param {number} z - the second 4D vector z component
// @param {number} w - the second 4D vector w component
// @returns {number} the dot product
function cdot(iv, x, y, z, w) {
    return (iv[0] * x  +  iv[1] * y  +  iv[2] * z  +  iv[3] * w)
}

// shift components of a vec4 with provided x/y/z/w values (alias to cadd) 
//
// @param {array/vec4} rv - the receiving 4D vector
// @param {array/vec4} iv - the source 4D vector
// @param {number} x
// @param {number} y
// @param {number} z
// @param {number} w
// @returns {obj/lib/vec4} vec4 library object for chaining
function shift(rv, iv, x, y, z, w) {
    rv[0] = iv[0] + x
    rv[1] = iv[1] + y
    rv[2] = iv[2] + z
    rv[3] = iv[3] + w
    return this
}

// shift components of a vec4 with provided x/y/z/w values into a new vec4 array
//
// @param {array/vec4} iv - the source 4D vector
// @param {number} x
// @param {number} y
// @param {number} z
// @param {number} w
// @returns {array/vec4} the created output 4D vector
function ishift(iv, x, y, z, w) {
    const nv = new Float32Array(4)
    nv[0] = iv[0] + x
    nv[1] = iv[1] + y
    nv[2] = iv[2] + z
    nv[3] = iv[3] + w
    return nv
}

// magnify a 4D vector array by a scalar value (scalar multiplication)
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv - the source 4D vector
// @param {number} scalar
// @returns {obj/lib/vec4} vec4 library object for chaining
function __scale__(rv, iv, scalar) {
    rv[0] = iv[0] * scalar
    rv[1] = iv[1] * scalar
    rv[2] = iv[2] * scalar
    rv[3] = iv[3] * scalar
    return this
}

// magnify a 4D vector into a new 4D vector array (scalar multiplication)
//
// @param {array/vec4} iv - the source 4D vector
// @param {number} scalar
// @returns {array/vec4} the created 4D vector array
function iscale(iv, scalar) {
    const nv = new Float32Array(4)
    nv[0] = iv[0] * scalar
    nv[1] = iv[1] * scalar
    nv[2] = iv[2] * scalar
    nv[3] = iv[3] * scalar
    return nv
}

// shrink a 4D vector array by a scalar value (scalar division)
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv - the source 4D vector
// @param {number} scalar
// @returns {obj/lib/vec4} vec4 library object for chaining
function shrink(rv, iv, scalar) {
    const nfactor = 1 / scalar
    rv[0] = iv[0] * nfactor
    rv[1] = iv[1] * nfactor
    rv[2] = iv[2] * nfactor
    rv[3] = iv[3] * nfactor
    return this
}

// shrink a 4D vector into a new 4D vector array (scalar division)
//
// @param {array/vec4} iv - the source 4D vector
// @param {number} scalar
// @returns {array/vec4} the created 4D vector array
function ishrink(iv, scalar) {
    const nv = new Float32Array(4)
    const nfactor = 1 / scalar
    nv[0] = iv[0] * nfactor
    nv[1] = iv[1] * nfactor
    nv[2] = iv[2] * nfactor
    nv[3] = iv[3] * nfactor
    return nv
}

// magnify the second 4D vector array by a scalar value and add the result to the first 4D vector
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv1 - the source 4D vector to add to
// @param {array/vec4} iv2 - the source 4D vector to scale
// @param {number} scalar
// @returns {obj/lib/vec4} vec4 library object for chaining
function scaleAndAdd(rv, iv1, iv2, scalar) {
    rv[0] = iv1[0] + iv2[0] * scalar
    rv[1] = iv1[1] + iv2[1] * scalar
    rv[2] = iv1[2] + iv2[2] * scalar
    rv[3] = iv1[3] + iv2[3] * scalar
    return this
}

// magnify the second 4D vector array by a scalar value and add to the first 4D vector
// into a new vector
//
// @param {array/vec4} iv1 - the source 4D vector to add to
// @param {array/vec4} iv2 - the source 4D vector to scale
// @param {number} scalar
// @returns {array/vec4} the created output 4D vector array
function iscaleAndAdd(iv1, iv2, scalar) {
    const nv = new Float32Array(4)
    nv[0] = iv1[0] + iv2[0] * scalar
    nv[1] = iv1[1] + iv2[1] * scalar
    nv[2] = iv1[2] + iv2[2] * scalar
    nv[3] = iv1[3] + iv2[3] * scalar
    return nv
}


// negate a 4D vector array
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv - the source 4D vector
// @returns {obj/lib/vec4} vec4 library object for chaining
function negate(rv, iv) {
    rv[0] = -iv[0]
    rv[1] = -iv[1]
    rv[2] = -iv[2]
    rv[3] = -iv[3]
    return this
}

// negate a 4D vector into a new 4D vector array
//
// @param {array/vec4} iv - the immutable source 4D vector
// @returns {array/vec4} the created 4D vector array
function inegate(iv) {
    const nv = new Float32Array(4)
    nv[0] = -iv[0]
    nv[1] = -iv[1]
    nv[2] = -iv[2]
    nv[3] = -iv[3]
    return nv
}

// inverse a 4D vector array
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv - the source 4D vector
// @returns {obj/lib/vec4} vec4 library object for chaining
function inverse(rv, iv) {
    rv[0] = 1 / iv[0]
    rv[1] = 1 / iv[1]
    rv[2] = 1 / iv[2]
    rv[3] = 1 / iv[3]
    return this
}

// inverse a 4D vector into a new 4D vector array
//
// @param {array/vec4} iv - the source 4D vector
// @returns {array/vec4} the created 4D vector array
function iinverse(iv) {
    const nv = new Float32Array(4)
    nv[0] = 1 / iv[0]
    nv[1] = 1 / iv[1]
    nv[2] = 1 / iv[2]
    nv[3] = 1 / iv[3]
    return nv
}

// ceil the components of a 4D vector
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv - the source 4D vector
// @returns {obj/lib/vec4} vec4 library object for chaining
function __ceil__(rv, iv) {
    rv[0] = Math.ceil(iv[0])
    rv[1] = Math.ceil(iv[1])
    rv[2] = Math.ceil(iv[2])
    rv[3] = Math.ceil(iv[3])
    return this
}

// ceil the components of a 4D vector into a new 4D vector array
//
// @param {array/vec4} iv - the source 4D vector (immutable)
// @returns {array/vec4} the created output 4D vector array
function iceil(iv) {
    const nv = new Float32Array(4)
    nv[0] = Math.ceil(iv[0])
    nv[1] = Math.ceil(iv[1])
    nv[2] = Math.ceil(iv[2])
    nv[3] = Math.ceil(iv[3])
    return nv
}

// floor the components of a 4D vector array
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv - the source 4D vector
// @returns {obj/lib/vec4} vec4 library object for chaining
function __floor__(rv, iv) {
    rv[0] = floor(iv[0])
    rv[1] = floor(iv[1])
    rv[2] = floor(iv[2])
    rv[3] = floor(iv[3])
    return this
}

// floor the components of a 4D vector into a new 4D vector array
//
// @param {array/vec4/immutable} iv - the source 4D vector
// @returns {array/vec4} the created output 4D vector array
function ifloor(iv) {
    const nv = new Float32Array(4)
    nv[0] = floor(iv[0])
    nv[1] = floor(iv[1])
    nv[2] = floor(iv[2])
    nv[3] = floor(iv[3])
    return nv
}

// round the components of a 4D vector array
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv - the source 4D vector
// @returns {obj/lib/vec4} vec4 library object for chaining
function __round__(rv, iv) {
    rv[0] = round(iv[0])
    rv[1] = round(iv[1])
    rv[2] = round(iv[2])
    rv[3] = round(iv[3])
    return this
}

// floor the components of a 4D vector into a new 4D vector array
//
// @param {array/vec4} iv - the source 4D vector (immutable)
// @returns {array/vec4} the created 4D vector array
function iround(iv) {
    const nv = new Float32Array(4)
    nv[0] = round(iv[0])
    nv[1] = round(iv[1])
    nv[2] = round(iv[2])
    nv[3] = round(iv[3])
    return nv
}

// normalize a 4D vector
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv - the source 4D vector
// @returns {obj/lib/vec4} vec4 library object for chaining
function normalize(rv, iv) {
    const x = iv[0], y = iv[1], z = iv[2], w = iv[3]
    const len2 = x*x + y*y + z*z + w*w
    if (len2 > 0) {
        const nfactor = 1 / Math.sqrt(len2)
        rv[0] = x * nfactor
        rv[1] = y * nfactor
        rv[2] = z * nfactor
        rv[3] = w * nfactor
    } else {
        // no direction information in the original vec4
        rv[0] = 0
        rv[1] = 0
        rv[2] = 0
        rv[3] = 0
    }
    return this
}

// normalize a 4D vector into a new 4D vector array
//
// @param {array/vec4} iv - the immutable source 4D vector array
// @returns {array/vec4} the created 4D vector array
function inormalize(iv) {
    const nv = new Float32Array(4)
    const x = iv[0], y = iv[1], z = iv[2], w = iv[3]
    const len2 = x*x + y*y + z*z + w*w
    if (len2 > 0) {
        const nfactor = 1 / Math.sqrt(len2)
        nv[0] = x * nfactor
        nv[1] = y * nfactor
        nv[2] = z * nfactor
        nv[3] = w * nfactor
    } else {
        // no direction information in the original vec4
        nv[0] = 0
        nv[1] = 0
        nv[2] = 0
        nv[3] = 0
    }
    return nv
}

// transform the 4D vector with the provided rotation mat3 into the receiving 4D vector array
//
// @param {array/vec3} rv - the receiving 4D vector array
// @param {array/vec3} iv - the source 4D vector array
// @param {array/mat3} tm - the transformation 3x3 matrix array
// @returns {obj/lib/vec4} vec4 library object
function applyMat3(rv, iv, tm) {
    const x = iv[0], y = iv[1], z = iv[2]

    rv[0] = x * tm[0]  +  y * tm[3]  +  z * tm[6]
    rv[1] = x * tm[1]  +  y * tm[4]  +  z * tm[7]
    rv[2] = x * tm[2]  +  y + tm[5]  +  z * tm[8]

    return this
}

// transform the 4D vector with the provided transformation mat3 into a new 4D vector array
//
// @param {array/vec3} iv - the source 4D vector array
// @param {array/mat3} tm - the transformation 3x3 matrix array
// @returns {obj/lib/vec3} the newly created 4D vector array
function iapplyMat3(iv, tm) {
    const nv = new Float32Array(4)
    const x = iv[0], y = iv[1], z = iv[2]

    nv[0] = x * tm[0]  +  y * tm[3]  +  z * tm[6]
    nv[1] = x * tm[1]  +  y * tm[4]  +  z * tm[7]
    nv[2] = x * tm[2]  +  y + tm[5]  +  z * tm[8]

    return nv
}

// transform the 4D vector with the provided transformation mat43 into the receiving 4D vector array
//
// TODO figure out if we need to factor [w !== 1] in this case
//
// @param {array/vec3} rv - the receiving 4D vector array
// @param {array/vec3} iv - the source 4D vector array
// @param {array/mat43} tm - the transformation 4x3 matrix array
// @returns {obj/lib/vec4} vec3 library object
function applyMat43(rv, iv, tm) {
    const x = iv[0], y = iv[1], z = iv[2], w = iv[3]

    rv[0] = x * tm[0]  +  y * tm[3]  +  z * tm[6]  +  w * tm[9 ]
    rv[1] = x * tm[1]  +  y * tm[4]  +  z * tm[7]  +  w * tm[10]
    rv[2] = x * tm[2]  +  y + tm[5]  +  z * tm[8]  +  w * tm[11]
    // nv[3] = 1 * w -- component stays the same

    return this
}

// transform the 4D vector with the provided transformation mat43 into a new 4D vector array
//
// @param {array/vec3} iv - the source 4D vector array
// @param {array/mat43} tm - the transformation 4x3 matrix array
// @returns {obj/vec4} the newly created 4D vector array
function iapplyMat43(iv, tm) {
    const nv = new Float32Array(4)
    const x = iv[0], y = iv[1], z = iv[2], w = iv[3]

    nv[0] = x * tm[0]  +  y * tm[3]  +  z * tm[6]  +  w * tm[9 ]
    nv[1] = x * tm[1]  +  y * tm[4]  +  z * tm[7]  +  w * tm[10]
    nv[2] = x * tm[2]  +  y + tm[5]  +  z * tm[8]  +  w * tm[11]
    // nv[3] = 1 * w -- component stays the same

    return nv
}

// transform the 4D vector with the provided transformation mat4 into the receiving 4D vector array
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv - the source 4D vector array
// @param {array/mat4} tm - the transformation 4x4 matrix array
// @returns {obj/lib/vec4} vec4 library object
function applyMat4(rv, iv, tm) {
    const x = iv[0], y = iv[1], z = iv[2], w = iv[3]

    rv[0] = x * tm[0]  +  y * tm[4]  +  z * tm[8 ]  +  tm[12] * w
    rv[1] = x * tm[1]  +  y * tm[5]  +  z * tm[9 ]  +  tm[13] * w
    rv[2] = x * tm[2]  +  y + tm[6]  +  z * tm[10]  +  tm[14] * w
    rv[3] = x * tm[3]  +  y + tm[7]  +  z * tm[11]  +  tm[15] * w

    return this
}

// transform the 4D vector with the provided transformation mat4 into a new 4D vector array
//
// @param {array/vec4} iv - the source 4D vector array
// @param {array/mat4} tm - the transformation 4x4 matrix array
// @returns {obj/vec4} the newly created 4D vector array
function iapplyMat4(iv, tm) {
    const nv = new Float32Array(4)
    const x = iv[0], y = iv[1], z = iv[2], w = iv[3]

    nv[0] = x * tm[0]  +  y * tm[4]  +  z * tm[8 ]  +  tm[12] * w
    nv[1] = x * tm[1]  +  y * tm[5]  +  z * tm[9 ]  +  tm[13] * w
    nv[2] = x * tm[2]  +  y + tm[6]  +  z * tm[10]  +  tm[14] * w
    nv[3] = x * tm[3]  +  y + tm[7]  +  z * tm[11]  +  tm[15] * w

    return nv
}


// linear interpolation between two 4D vectors
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {array/vec4} iv1 - the first vec4(immutable)
// @param {array/vec4} iv2 - the second vec4(immutable)
// @param {number} t - the interpolation amount between inputs [0 - 1]
// @returns {obj/lib/vec4} vec4 library object for chaining
function __lerp__(rv, iv1, iv2, t) {
    const x1 = iv1[0], y1 = iv1[1], z1 = iv1[2], w1 = iv1[3]
    rv[0] = x1 + t * (iv2[0] - x1)
    rv[1] = y1 + t * (iv2[1] - y1)
    rv[2] = z1 + t * (iv2[2] - z1)
    rv[3] = w1 + t * (iv2[3] - w1)
    return this
}

function cross() {
}

// euclidian distance between two 4D vectors
//
// @param {array/vec4} iv1 - the first operand (immutable)
// @param {array/vec4} iv2 - the second operand (immutable)
// @returns {number} euclidian distance between iv1 and iv2
function dist(iv1, iv2) {
    return Math.hypot(iv1[0] - iv2[0], iv1[1] - iv2[1], iv1[2] - iv2[2], iv1[3] - iv2[3])
}

// squared euclidian distance between two 4D vectors
//
// @param {array/vec4} iv1 - the first operand (immutable)
// @param {array/vec4} iv2 - the second operand (immutable)
// @returns {number} squared euclidian distance between iv1 and iv2
function distSq(iv1, iv2) {
    const dx = iv1[0] - iv2[0]
    const dy = iv1[1] - iv2[1]
    const dz = iv1[2] - iv2[2]
    const dw = iv1[3] - iv2[3]
    return (dx * dx + dy * dy + dz * dz + dw * dw)
}

// euclidian distance between two 4D vectors
//
// @param {array/vec4} iv1 - the first operand (immutable)
// @param {array/vec4} iv2 - the second operand (immutable)
// @returns {number} euclidian distance between iv1 and iv2
function __distance__(iv1, iv2) {
    return Math.hypot(iv1[0] - iv2[0], iv1[1] - iv2[1], iv1[2] - iv2[2], iv1[3] - iv2[3])
}

// squared euclidian distance between two 4D vectors
//
// @param {array/vec4} iv1 - the first operand (immutable)
// @param {array/vec4} iv2 - the second operand (immutable)
// @returns {number} squared euclidian distance between iv1 and iv2
function distanceSq(iv1, iv2) {
    const dx = iv1[0] - iv2[0]
    const dy = iv1[1] - iv2[1]
    const dz = iv1[2] - iv2[2]
    const dw = iv1[3] - iv2[3]
    return (dx * dx + dy * dy + dz * dz + dw * dw)
}

// magnitude(length) of a 4D vector
//
// @param {array/vec4} iv - the immutable source vec4 array
// @returns {number} the magnitude(length) of the provided vec4
function mag(iv) {
    return Math.hypot(iv[0], iv[1], iv[2], iv[3])
}

// set the magnitude(length) of a 4D vector
//
// If the magnitude of the source array is 0, [0, 0, 0, 0] will be set
//
// @param {array/vec4} rv - the receiving 4D vector
// @param {array/vec4} iv - the immutable source vec4 array
// @param {number} - the intended magnitude
// @returns {obj/lib/vec4} vec4 library object for chaining
function setMag(rv, iv, mag) {
    const curMag = Math.hypot(iv[0], iv[1], iv[2], iv[3])
    if (curMag === 0) {
        rv[0] = rv[1] = rv[2] = rv[3] = 0
    } else {
        const mfactor = (1 / curMag) * mag
        rv[0] = iv[0] * mfactor
        rv[1] = iv[1] * mfactor
        rv[2] = iv[2] * mfactor
        rv[3] = iv[3] * mfactor
    }
    return this
}

// set the magnitude(length) of a 3D vector for a cloned 3D vector array
//
// If the magnitude of the source array is 0, [0, 0, 0, 0] will be returned
//
// @param {array/vec4/immutable} iv - the source 4D vector
// @param {number} - the target magnitude to set
// @returns {array/vec4} created 4D vector array with desired magnitude
function isetMag(iv, mag) {
    const nv = new Float32Array(4)
    const curMag = Math.hypot(iv[0], iv[1], iv[2], iv[3])
    if (curMag === 0) {
        nv[0] = nv[1] = nv[2] = nv[3] = 0
    } else {
        const mfactor = (1 / curMag) * mag
        nv[0] = iv[0] * mfactor
        nv[1] = iv[1] * mfactor
        nv[2] = iv[2] * mfactor
        nv[3] = iv[3] * mfactor
    }
    return nv
}

// length(magnitude) of a 4D vector
//
// _API Note: We can't provide the .length() alias
// due to the existing .length() method on every function object.
// Don't be misled by the presence of .length() in vec2 -
// it doesn't return a vector length, but the length of
// the function's argument list._
//
// @param {array/vec4/immutable} iv - the source 4D vector array
// @returns {number} the length(magnitude) of the provided 4D vector
function len(iv) {
    return Math.hypot(iv[0], iv[1], iv[2], iv[3])
}

// squared length(magnitude) of a 4D vector
//
// @param {array/vec4/immutable} iv - the source 4D vector
// @returns {number} the squared length of the provided 4D vector
function lenSq(iv) {
    return (iv[0] * iv[0] + iv[1] * iv[1] + iv[2] * iv[2] + iv[3] * iv[3])
}

// test if two 4D vectors have equal components
//
// @param {array/vec4/immutable} iv1 - the first 4D vector
// @param {array/vec4/immutable} iv2 - the second 4D vector
// @returns {boolean} true if vectors components are equal, false otherwise
function equals(iv1, iv2) {
    return (iv1[0] === iv2[0] && iv1[1] === iv2[1] && iv1[2] === iv2[2] && iv1[3] === iv2[3])
}

// test if two 4D vectors have near-equal components with EPSILON precision factor
//
// @param {array/vec4/immutable} iv1 - the first 4D vector
// @param {array/vec4/immutable} iv2 - the second 4D vector
// @param {number} epsilon - (optional) precision factor for near-comparison
// @returns {boolean} true if vectors components are near-equal, false otherwise
function near(iv1, iv2, epsilon) {
    epsilon = epsilon ?? EPSILON
    const x1 = iv1[0], y1 = iv1[1], z1 = iv1[2], w1 = iv1[3]
    const x2 = iv2[0], y2 = iv2[1], z2 = iv2[2], w2 = iv2[3]
    return (
           Math.abs(x1 - x2) <= epsilon * Math.max(1, x1, x2)
        && Math.abs(y1 - y2) <= epsilon * Math.max(1, y1, y2)
        && Math.abs(z1 - z2) <= epsilon * Math.max(1, z1, z2)
        && Math.abs(w1 - w2) <= epsilon * Math.max(1, w1, w2)
    )
}

// map a 4D vector array into a target object with optional names
//
// @param {object} tar - the target object to map vec4 values into
// @param {array/vec4/immutable} iv - the source 4D vector
// @param {string} xn - optional property name for the x component ("x" by default)
// @param {string} yn - optional property name for the y component ("y" by default)
// @param {string} zn - optional property name for the z component ("z" by default)
// @param {string} wn - optional property name for the w component ("w" by default)
// @returns {obj/lib/vec4} vec4 library object for chaining
function map(tar, iv, xn, yn, zn, wn) {
    xn = xn || 'x'
    yn = yn || 'y'
    zn = zn || 'z'
    wn = wn || 'w'

    tar[xn] = iv[0]
    tar[yn] = iv[1]
    tar[zn] = iv[2]
    tar[wn] = iv[3]

    return this
}

// map a 4D vector array into the new target object with optional names
//
// @param {array/vec4/immutable} iv - the source 4D vector
// @param {string} xn - optional property name for the x component ("x" by default)
// @param {string} yn - optional property name for the y component ("y" by default)
// @param {string} yn - optional property name for the z component ("z" by default)
// @param {string} wn - optional property name for the w component ("w" by default)
// @returns {obj} created object with mapped 4D vector values
function imap(iv, xn, yn, zn, wn) {
    const out = {}
    xn = xn || 'x'
    yn = yn || 'y'
    zn = zn || 'z'
    wn = wn || 'w'

    out[xn] = iv[0]
    out[yn] = iv[1]
    out[zn] = iv[2]
    out[wn] = iv[3]

    return out
}

// decode (deconstruct) an object with 4D vector data into the target 4D vector array
//
// @param {array/vec4} rv - the receiving 4D vector array
// @param {object} io - the input object with 4D vector data
// @param {string} xn - the optional property name for the 'x' value
// @param {string} yn - the optional property name for the 'y' value
// @param {string} zn - the optional property name for the 'z' value
// @param {string} wn - the optional property name for the 'w' value
// @returns {obj/lib/vec4} vec4 library object for chaining
function decode(rv, io, xn, yn, zn, wn) {
    xn = xn ?? 'x'
    yn = yn ?? 'y'
    zn = zn ?? 'z'
    wn = wn ?? 'w'

    rv[0] = io[xn] ?? rv[0]
    rv[1] = io[yn] ?? rv[1]
    rv[2] = io[zn] ?? rv[2]
    rv[3] = io[wn] ?? rv[3]

    return this
}

// decode (deconstruct) an object with 4D vector data into the new 3D vector array
//
// @param {object} io - the input object with 4D vector data
// @param {string} xn - the optional property name for the 'x' value
// @param {string} yn - the optional property name for the 'y' value
// @param {string} zn - the optional property name for the 'z' value
// @param {string} wn - the optional property name for the 'w' value
// @returns {array} created 4D vector array with deconstructed data
function idecode(io, xn, yn, zn, wn) {
    const nv = new Float32Array(4)

    xn = xn ?? 'x'
    yn = yn ?? 'y'
    zn = zn ?? 'z'
    wn = wn ?? 'w'

    nv[0] = io[xn] ?? 0
    nv[1] = io[yn] ?? 0
    nv[2] = io[zn] ?? 0
    nv[3] = io[wn] ?? 0

    return nv
}

// transform a 4D vector into an object {x, y, z, w}
// 
// @param {array/vec4/immutable} iv - the source 4D vector
// @returns {object} the transformed object with {x, y, z, w} coordinates defined
function obj(iv) {
    return {
        x: iv[0],
        y: iv[1],
        z: iv[2],
        w: iv[3]
    }
}

// get 4D vector array string representation
//
// @param {array/vec4/immutable} iv - the source 4D vector
// @returns {string} the 4D vector array data string representation
function str(iv) {
    return `[${iv[0]}, ${iv[1]}, ${iv[2]}, ${iv[3]}]`
}

// get a 4D vector array formatted string representation
//
// @param {array/vec4/immutable} iv - the source 4D vector
// @param {string} s - optional separator
// @param {string} p - optional prefix
// @param {string} x - optional suffix
// @returns {string} the formatted 4D vector string
function fmt(iv, s, p, x) {
    s = s ?? ', '
    p = p ?? '['
    x = x ?? ']'
    return `${p}${iv[0]}${s}${iv[1]}${s}${iv[2]}${s}${iv[3]}${x}`
}

// get a 4D vector array string dump
//
// @param {array/vec4/immutable} iv - the source 4D vector
// @returns {string} the 4D vector string representation
function dump(iv) {
    return `vec4[${iv[0]}, ${iv[1]}, ${iv[2]}, ${iv[3]}]`
}

// validate that provided object is a proper 4D vector
//
// @param {array/vec4/immutable} iv - the source 4D vector
// @returns {boolean} true if a valid 4D vector array provided, false otherwise
function validate(iv) {
    const TypedArray = Object.getPrototypeOf(Uint8Array)
    if (!Array.isArray(iv) && !(iv instanceof TypedArray)) return false
    if (iv.length !== 4) return false
    for (let i = 0; i < 4; i++) {
        if (iv[i] == null || !Number.isFinite(iv[i])) return false
    }
    return true
}

// assert a 4D vector, throws an error when the vector is malformed
//
// Any 4D vector is required to have 4 number components.
//
// @param {array/vec4/immutable} iv - the source 4D vector
// @returns {obj/lib/vec4} vec4 library object for chaining
function __assert__(iv, tag) {
    tag = tag || 'vec4'
    const TypedArray = Object.getPrototypeOf(Uint8Array)
    if (!Array.isArray(iv) && !(iv instanceof TypedArray)) throw Error(`[${tag}] is expected to be an array or a typed Uint8 array!`)
    if (iv.length !== 4) throw Error(`[${tag}] is expected to have 4 elements!`)
    for (let i = 0; i < 4; i++) {
        const e = iv[i]
        if (e == null || !Number.isFinite(e)) {
            throw new Error(`[${tag}]#${i+1} component is expected to be a number, but [${e}] found!`)
        }
    }
    return this
}

function vec4(x, y, z, w) {
    const nv = new Float32Array(4)

    if (arguments.length === 0) {
        return nv
    } else if (arguments.length === 1) {
        if (isArr(x)) {
            nv[0] = x[0] || 0
            nv[1] = x[1] || 0
            nv[2] = x[2] || 0
            nv[3] = x[3] || 0
        } else if (isObj(x)) {
            nv[0] = x.x || 0
            nv[1] = x.y || 0
            nv[2] = x.z || 0
            nv[3] = x.w || 0
        } else {
            nv[0] = x
        }
    } else if (arguments.length === 2) {
        if (isArr(x)) {
            if (x.length === 2) {
                nv[0] = x[0] || 0
                nv[1] = x[1] || 0
                nv[2] = y
            } else if (x.length === 3) {
                nv[0] = x[0] || 0
                nv[1] = x[1] || 0
                nv[2] = x[2] || 0
                nv[3] = y
            }
        } else if (isObj(x)) {
            nv[0] = x.x || 0
            nv[1] = x.y || 0
            nv[2] = x.z || 0
            nv[3] = y
        } else {
            nv[0] = x
            nv[1] = y
        }
    } else if (arguments.length === 3) {
        if (isArr(x)) {
            nv[0] = x[0] || 0
            nv[1] = x[1] || 0
            nv[2] = y
            nv[3] = z
        } else if (isObj(x)) {
            nv[0] = x.x || 0
            nv[1] = x.y || 0
            nv[2] = y
            nv[3] = z
        } else {
            nv[0] = x
            nv[1] = y
            nv[2] = z
        }
    } else {
        nv[0] = x
        nv[1] = y
        nv[2] = z
        nv[3] = w
    }
    return nv
}

extend(vec4, {
    rx: create(),

    create,
    xcreate,
    zero,
    izero,
    unit,
    iunit,
    clone,
    copy,
    set,
    // TODO must be another implementation that requires values (no optional x/y...)
    from: create,

    add,
    iadd,
    cadd,
    sub,
    isub,
    csub,
    mul,
    imul,
    cmul,
    div,
    idiv,
    cdiv,
    dot,
    cdot,

    shift,
    ishift,
    scale: __scale__,
    iscale: iscale,
    shrink,
    ishrink,
    scaleAndAdd,
    iscaleAndAdd,
    negate,
    inegate,
    inverse,
    iinverse,
    ceil: __ceil__,
    iceil,
    floor: __floor__,
    ifloor,
    round: __round__,
    iround,
    normalize,
    inormalize,

    applyMat3,
    iapplyMat3,
    applyMat43,
    iapplyMat43,
    applyMat4,
    iapplyMat4,

    lerp: __lerp__,
    dist,
    distSq,
    distance: __distance__,
    distanceSq: distanceSq,

    mag,
    setMag,
    isetMag,
    len,
    lenSq,
    equals,
    near,

    map,
    imap,
    decode,
    idecode,
    obj,
    str,
    fmt,
    dump,
    validate,
    assert: __assert__,
})
math.vec4 = vec4
