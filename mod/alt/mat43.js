// Interface for 4x3 Matrix Operations
//


// set the 4x3 identity matrix
// ```
// | 1 0 0 0 |
// | 0 1 0 0 |
// | 0 0 1 0 |
// ```
// @param {array} rm - a receiving 4x3 matrix array to mutate
// @returns {obj/lib/mat43} mat43 lib object for chaining
function identity(rm) {
    rm[0 ] = 1
    rm[1 ] = 0
    rm[2 ] = 0

    rm[3 ] = 0
    rm[4 ] = 1
    rm[5 ] = 0

    rm[6 ] = 0
    rm[7 ] = 0
    rm[8 ] = 1

    rm[9 ] = 0
    rm[10] = 0
    rm[11] = 0

    return this
}

// create a new 4x3 identity matrix
//
// @returns {Float32Array} a new 4x3 identity matrix array
function create() {
    const nm = new Float32Array(12)

    // set identity
    nm[0]  = 1
    nm[4]  = 1
    nm[8]  = 1

    return nm
}

// create and register a 4x3 identity matrix in mat43.rx
// ```
// | 1 0 0 0 |
// | 0 1 0 0 |
// | 0 0 1 0 |
// ```
// @returns {obj/lib/mat43} mat43 lib object for chaining
function xcreate() {
    const nm = new Float32Array(12)

    nm[0] = 1
    nm[4] = 1
    nm[8] = 1

    this.rx = nm
    return this
}

// fill a 4x3 matrix with zeroes
//
// @returns {obj/lib/mat43} mat43 lib object for chaining
function zero(rm) {
    rm[0 ] = 0
    rm[1 ] = 0
    rm[2 ] = 0

    rm[3 ] = 0
    rm[4 ] = 0
    rm[5 ] = 0

    rm[6 ] = 0
    rm[7 ] = 0
    rm[8 ] = 0

    rm[9 ] = 0
    rm[10] = 0
    rm[11] = 0

    return this
}

// creates a zero-filled 4x3 matrix
//
// @returns {Float32Array} a new zero-filled 4x3 matrix array
function izero() {
    return new Float32Array(12)
}

// copy a source 4x3 matrix array to the target one
//
// @param {array/mat43} rm - the receiving 4x3 matrix array
// @param {array/mat43} im - the source 4x3 matrix array
// @returns {obj/lib/mat43} mat43 lib object for chaining
function copy(rv, im) {
    for (let i = 0; i < 12; i++) rv[i] = im[i] ?? rv[i]

    return this
}

// clone an existing 4x3 matrix array
// 
// @param {array/mat43} im - a 4x3 matrix array to copy
// @returns {Float32Array} - a new cloned 4x3 matrix
function clone(im) {
    const nm = new Float32Array(12)

    nm[ 0] = im[ 0] ?? 1
    nm[ 1] = im[ 1] ?? 0
    nm[ 2] = im[ 2] ?? 0

    nm[ 3] = im[ 3] ?? 0
    nm[ 4] = im[ 4] ?? 1
    nm[ 5] = im[ 5] ?? 0

    nm[ 6] = im[ 6] ?? 0
    nm[ 7] = im[ 7] ?? 0
    nm[ 8] = im[ 8] ?? 1

    nm[ 9] = im[ 9] ?? 0
    nm[10] = im[10] ?? 0
    nm[11] = im[11] ?? 0

    return nm
}

// create a 4x3 matrix out of a 4x4 matrix array
//
// @param {array/mat4} im - the source immutable 4x4 matrix array
// @returns {Float32Array} the newly formed 4x3 matrix array
function fromMat4(im) {
    const nm = new Float32Array(12)

    nm[0 ] = im[0 ] ?? 1
    nm[1 ] = im[1 ] ?? 0
    nm[2 ] = im[2 ] ?? 0

    nm[3 ] = im[4 ] ?? 0
    nm[4 ] = im[5 ] ?? 1
    nm[5 ] = im[6 ] ?? 0

    nm[6 ] = im[8 ] ?? 0
    nm[7 ] = im[9 ] ?? 0
    nm[8 ] = im[10] ?? 1

    nm[9 ] = im[12] ?? 0
    nm[10] = im[13] ?? 0
    nm[11] = im[14] ?? 0

    return nm
}

// create a 4x3 column-major matrix (OpenGL standard) out of a 4x3 row-major matrix array
//
// @param {array/mat43R} im - the source immutable 4x3 row-major matrix array
// @returns {Float32Array} the newly formed 4x3 matrix array
function fromMat43R(im) {
    const nm = new Float32Array(12)

    nm[0 ] = im[0 ] ?? 1
    nm[1 ] = im[4 ] ?? 0
    nm[2 ] = im[8 ] ?? 0

    nm[3 ] = im[1 ] ?? 0
    nm[4 ] = im[5 ] ?? 1
    nm[5 ] = im[9 ] ?? 0

    nm[6 ] = im[2 ] ?? 0
    nm[7 ] = im[6 ] ?? 0
    nm[8 ] = im[10] ?? 1

    nm[9 ] = im[3 ] ?? 0
    nm[10] = im[7 ] ?? 0
    nm[11] = im[11] ?? 0

    return nm
}

// set 4x3 matrix rotation values from the quaternion
//
// Note, that translation components (the 4th column) are ignored by this operation.
//
// @param {array} rm - the receiving 4x3 mutable matrix array
// @params {array/quat} q - the source quaternion
// @returns {obj/lib/mat43} mat43 lib object for chaining
function setQuat(rm, q) {
    const s = 2/(q.x*q.x + q.y*q.y + q.z*q.z + q.w * q.w)

    const xs = s*q.x,  ys = s*q.y,  zs = s*q.z,
          wx = q.w*xs, wy = q.w*ys, wz = q.w*zs,
          xx = q.x*xs, xy = q.x*ys, xz = q.x*zs,
          yy = q.y*ys, yz = q.y*zs, zz = q.z*zs

    rm[0] = 1 - (yy + zz)
    rm[1] = xy + wz
    rm[2] = xz - wy

    rm[3] = xy - wz
    rm[4] = 1 - (xx + zz)
    rm[5] = yz + wx

    rm[6] = xz + wy
    rm[7] = yz - wx
    rm[8] = 1 - (xx + yy)

    return this
}

// create new rotational 4x3 matrix from the quaternion
//
// @params {array/quat} q - the source quaternion
// @returns {array/mat43} created 4x3 matrix array
function fromQuat(q) {
    const nm = new Float32Array(12)

    const s = 2/(q.x*q.x + q.y*q.y + q.z*q.z + q.w * q.w)

    const xs = s*q.x,  ys = s*q.y,  zs = s*q.z,
          wx = q.w*xs, wy = q.w*ys, wz = q.w*zs,
          xx = q.x*xs, xy = q.x*ys, xz = q.x*zs,
          yy = q.y*ys, yz = q.y*zs, zz = q.z*zs

    nm[0] = 1 - (yy + zz)
    nm[1] = xy + wz
    nm[2] = xz - wy

    nm[3] = xy - wz
    nm[4] = 1 - (xx + zz)
    nm[5] = yz + wx

    nm[6] = xz + wy
    nm[7] = yz - wx
    nm[8] = 1 - (xx + yy)

    nm[9 ] = 0
    nm[10] = 0
    nm[11] = 0

    return nm
}

// create a 4x3 matrix array from the provided values
//
// @param {number} v11
// @param {number} v12
// @param {number} v13
// @param {number} v21
// @param {number} v22
// @param {number} v23
// @param {number} v31
// @param {number} v32
// @param {number} v33
// @param {number} v41
// @param {number} v42
// @param {number} v43
// @returns {Float32Array} the newly formed 4x3 matrix array
function from(v11, v12, v13,  v21, v22, v23,  v31, v32, v33,  v41, v42, v43) {
    const nm = new Float32Array(12)

    nm[0 ] = v11 ?? 1
    nm[1 ] = v12 ?? 0
    nm[2 ] = v13 ?? 0

    nm[3 ] = v21 ?? 0
    nm[4 ] = v22 ?? 1
    nm[5 ] = v23 ?? 0

    nm[6 ] = v31 ?? 0
    nm[7 ] = v32 ?? 0
    nm[8 ] = v33 ?? 1

    nm[9 ] = v41 ?? 0
    nm[10] = v42 ?? 0
    nm[11] = v43 ?? 0

    return nm
}

// create a 4x3 matrix array out of x4 2D/3D/4D vectors
//
// @param {array/vec4} iv1 - the 2D/3D/4D vector array for the first column
// @param {array/vec4} iv2 - the 2D/3D/4D vector array for the second column
// @param {array/vec4} iv3 - the 2D/3D/4D vector array for the third column
// @param {array/vec4} iv3 - the 2D/3D/4D vector array for the forth column
// @returns {Float32Array} the newly formed 4x4 matrix array
function fromAxes(iv1, iv2, iv3, iv4) {
    const nm = new Float32Array(12)

    nm[0 ] = iv1[0] ?? 1
    nm[1 ] = iv1[1] ?? 0
    nm[2 ] = iv1[2] ?? 0

    nm[3 ] = iv2[0] ?? 0
    nm[4 ] = iv2[1] ?? 1
    nm[5 ] = iv2[2] ?? 0

    nm[6 ] = iv3[0] ?? 0
    nm[7 ] = iv3[1] ?? 0
    nm[8 ] = iv3[2] ?? 1

    nm[9 ] = iv4[0] ?? 0
    nm[10] = iv4[1] ?? 0
    nm[11] = iv4[2] ?? 0

    return nm
}

function setAxes(rm, iv1, iv2, iv3, iv4) {
    rm[0 ] = iv1[0]
    rm[1 ] = iv1[1]
    rm[2 ] = iv1[2]

    rm[3 ] = iv2[0]
    rm[4 ] = iv2[1]
    rm[5 ] = iv2[2]

    rm[6 ] = iv3[0]
    rm[7 ] = iv3[1]
    rm[8 ] = iv3[2]

    rm[9 ] = iv4[0]
    rm[10] = iv4[1]
    rm[11] = iv4[2]

    return nm
}

function setMat4(rm, im) {
    rm[0 ] = im[0 ]
    rm[1 ] = im[1 ]
    rm[2 ] = im[2 ]
    rm[3 ] = 0

    rm[4 ] = im[3 ]
    rm[5 ] = im[4 ]
    rm[6 ] = im[5 ]
    rm[7 ] = 0

    rm[8 ] = im[6 ]
    rm[9 ] = im[7 ]
    rm[10] = im[8 ]
    rm[11] = 0

    rm[12] = im[9 ]
    rm[13] = im[10]
    rm[14] = im[11]
    rm[15] = 1
}

function setFromMat4(rm, im) {
    rm[0 ] = im[0 ]
    rm[1 ] = im[1 ]
    rm[2 ] = im[2 ]

    rm[3 ] = im[4 ]
    rm[4 ] = im[5 ]
    rm[5 ] = im[6 ]

    rm[6 ] = im[8 ]
    rm[7 ] = im[9 ]
    rm[8 ] = im[10]

    rm[9 ] = im[12]
    rm[10] = im[13]
    rm[11] = im[14]
}

// set values for 4x3 matrix
//
// @param {array} rm - the receiving 4x3 mutable matrix array
// @param {number} v11
// @param {number} v12
// @param {number} v13
// @param {number} v21
// @param {number} v22
// @param {number} v23
// @param {number} v31
// @param {number} v32
// @param {number} v33
// @param {number} v41
// @param {number} v42
// @param {number} v43
// @returns {array} 
function set(rm,  v11, v12, v13,  v21, v22, v23,  v31, v32, v33,  v41, v42, v43) {
    rm[0 ] = v11 ?? rm[0 ]
    rm[1 ] = v12 ?? rm[1 ]
    rm[2 ] = v13 ?? rm[2 ]

    rm[3 ] = v21 ?? rm[3 ]
    rm[4 ] = v22 ?? rm[4 ]
    rm[5 ] = v23 ?? rm[5 ]

    rm[6 ] = v31 ?? rm[6 ]
    rm[7 ] = v32 ?? rm[7 ]
    rm[8 ] = v33 ?? rm[8 ]

    rm[9 ] = v41 ?? rm[9 ]
    rm[10] = v42 ?? rm[10]
    rm[11] = v43 ?? rm[11]

    return this
}

// extract a vec3 out of a specified 4x3 matrix column
//
// @param {array/vec3} rv - the receiving 3D vector array
// @param {array/mat43} im - the source 4x3 matrix array
// @param {number} i - the column to extract (assuming the matrix is column-major)
// @returns {obj/lib/mat43} mat43 lib object for chaining
function extractVec3(rv, m, i) {
    i *= 3
    rv[0] = m[i  ]
    rv[1] = m[i+1]
    rv[2] = m[i+2]

    return this
}

// extract a new vec3 array out of a specified 4x3 matrix column
//
// @param {array/mat43} im - the source 4x3 matrix array
// @param {number} i - the column to extract (assuming the matrix is column-major)
// @returns {Float32Array/vec3} the newly created 3D vector array
function iextractVec3(m, i) {
    const nv = new Float32Array(3)

    i *= 3
    nv[0] = m[i  ]
    nv[1] = m[i+1]
    nv[2] = m[i+2]

    return nv
}

// add two 4x3 matrices into the target 4x3 matrix array
//
// @param {array/mat43} rm - the receiving 4x3 matrix array
// @param {array} m - an immutable term 4x3 matrix array
// @param {array} n - an immutable term 4x3 matrix array
// @returns {obj/lib/mat43} mat43 lib object for chaining
function add(rm, m, n) {
    rm[ 0] = m[ 0] + n[ 0]
    rm[ 1] = m[ 1] + n[ 1]
    rm[ 2] = m[ 2] + n[ 2]

    rm[ 3] = m[ 3] + n[ 3]
    rm[ 4] = m[ 4] + n[ 4]
    rm[ 5] = m[ 5] + n[ 5]

    rm[ 6] = m[ 6] + n[ 6]
    rm[ 7] = m[ 7] + n[ 7]
    rm[ 8] = m[ 8] + n[ 8]

    rm[ 9] = m[ 9] + n[ 9]
    rm[10] = m[10] + n[10]
    rm[11] = m[11] + n[11]

    return this
}

// add two 4x3 matrices into a new 3x3 matrix array
//
// @param {array} m - an immutable term 4x3 matrix array
// @param {array} n - an immutable term 4x3 matrix array
// @returns {array/mat43} created 4x3 matrix array with addition results
function iadd(m, n) {
    const nm = new Float32Array(12)

    nm[ 0] = m[ 0] + n[0]
    nm[ 1] = m[ 1] + n[1]
    nm[ 2] = m[ 2] + n[2]

    nm[ 3] = m[ 3] + n[3]
    nm[ 4] = m[ 4] + n[4]
    nm[ 5] = m[ 5] + n[5]

    nm[ 6] = m[ 6] + n[6]
    nm[ 7] = m[ 7] + n[7]
    nm[ 8] = m[ 8] + n[8]

    nm[ 9] = m[ 9] + n[ 9]
    nm[10] = m[10] + n[10]
    nm[11] = m[11] + n[11]

    return nm
}

// subtract 4x3 matrix n from 4x3 matrix m into the receiving 4x3 matrix array
//
// @param {array/mat43} rm - the receiving 4x3 matrix array
// @param {array} m - an immutable term 4x3 matrix array
// @param {array} n - an immutable term 4x3 matrix array
// @returns {obj/lib/mat43} mat43 lib object for chaining
function sub(rm, m, n) {
    rm[ 0] = m[ 0] - n[ 0]
    rm[ 1] = m[ 1] - n[ 1]
    rm[ 2] = m[ 2] - n[ 2]

    rm[ 3] = m[ 3] - n[ 3]
    rm[ 4] = m[ 4] - n[ 4]
    rm[ 5] = m[ 5] - n[ 5]

    rm[ 6] = m[ 6] - n[ 6]
    rm[ 7] = m[ 7] - n[ 7]
    rm[ 8] = m[ 8] - n[ 8]

    rm[ 9] = m[ 9] - n[ 9]
    rm[10] = m[10] - n[10]
    rm[11] = m[11] - n[11]

    return this
}

// subtract 4x3 matrix n from 4x3 matrix m into a new 4x3 matrix array
//
// @param {array} m - an immutable term 4x3 matrix array
// @param {array} n - an immutable term 4x3 matrix array
// @returns {array/mat43} created 4x3 matrix array with subtraction results
function isub(m, n) {
    const nm = new Float32Array(12)

    nm[ 0] = m[ 0] - n[ 0]
    nm[ 1] = m[ 1] - n[ 1]
    nm[ 2] = m[ 2] - n[ 2]

    nm[ 3] = m[ 3] - n[ 3]
    nm[ 4] = m[ 4] - n[ 4]
    nm[ 5] = m[ 5] - n[ 5]

    nm[ 6] = m[ 6] - n[ 6]
    nm[ 7] = m[ 7] - n[ 7]
    nm[ 8] = m[ 8] - n[ 8]

    nm[ 9] = m[ 9] - n[ 9]
    nm[10] = m[10] - n[10]
    nm[11] = m[11] - n[11]

    return nm
}

// multiply two 4x3 matrices
//
// @param {array/mat4} rm - the receiving 4x3 matrix array
// @param {array/mat4} m - the first 4x3 matrix operand
// @param {array/mat4} n - the second 4x3 matrix operand
// @return {object/lib} the mat4 library object
function mul(rm, m, n) {
    const m11 = m[0 ],  m12 = m[1 ], m13 = m[2 ],
          m21 = m[3 ],  m22 = m[4 ], m23 = m[5 ],
          m31 = m[6 ],  m32 = m[7 ], m33 = m[8 ],
          m41 = m[9 ],  m42 = m[10], m43 = m[11]
    
    const n11 = n[0 ], n12 = n[1 ], n13 = n[2 ],
          n21 = n[3 ], n22 = n[4 ], n23 = n[5 ],
          n31 = n[6 ], n32 = n[7 ], n33 = n[8 ],
          n41 = n[9 ], n42 = n[10], n43 = n[11]

    rm[0 ] = n11 * m11  +  n12 * m21  +  n13 * m31
    rm[1 ] = n11 * m12  +  n12 * m22  +  n13 * m32
    rm[2 ] = n11 * m13  +  n12 * m23  +  n13 * m33

    rm[3 ] = n21 * m11  +  n22 * m21  +  n23 * m31
    rm[4 ] = n21 * m12  +  n22 * m22  +  n23 * m32
    rm[5 ] = n21 * m13  +  n22 * m23  +  n23 * m33

    rm[6 ] = n31 * m11  +  n32 * m21  +  n33 * m31
    rm[7 ] = n31 * m12  +  n32 * m22  +  n33 * m32
    rm[8 ] = n31 * m13  +  n32 * m23  +  n33 * m33

    rm[9 ] = n41 * m11  +  n42 * m21  +  n43 * m31  +  m41
    rm[10] = n41 * m12  +  n42 * m22  +  n43 * m32  +  m42
    rm[11] = n41 * m13  +  n42 * m23  +  n43 * m33  +  m43

    return mat43
}

// multiply two 4x3 matrices into a new 4x3 matrix array by 4x4 extension
//
// @param {array/mat43} m - the first 4x3 matrix operand
// @param {array/mat43} n - the second 4x3 matrix operand
// @returns {array/mat43} created 4x3 matrix array with multiplication results
function imul(m, n) {
    const nm = new Float32Array(12)

    const m11 = m[0 ],  m12 = m[1 ], m13 = m[2 ],
          m21 = m[3 ],  m22 = m[4 ], m23 = m[5 ],
          m31 = m[6 ],  m32 = m[7 ], m33 = m[8 ],
          m41 = m[9 ],  m42 = m[10], m43 = m[11]
    
    const n11 = n[0 ], n12 = n[1 ], n13 = n[2 ],
          n21 = n[3 ], n22 = n[4 ], n23 = n[5 ],
          n31 = n[6 ], n32 = n[7 ], n33 = n[8 ],
          n41 = n[9 ], n42 = n[10], n43 = n[11]

    nm[0 ] = n11 * m11  +  n12 * m21  +  n13 * m31
    nm[1 ] = n11 * m12  +  n12 * m22  +  n13 * m32
    nm[2 ] = n11 * m13  +  n12 * m23  +  n13 * m33

    nm[3 ] = n21 * m11  +  n22 * m21  +  n23 * m31
    nm[4 ] = n21 * m12  +  n22 * m22  +  n23 * m32
    nm[5 ] = n21 * m13  +  n22 * m23  +  n23 * m33

    nm[6 ] = n31 * m11  +  n32 * m21  +  n33 * m31
    nm[7 ] = n31 * m12  +  n32 * m22  +  n33 * m32
    nm[8 ] = n31 * m13  +  n32 * m23  +  n33 * m33

    nm[9 ] = n41 * m11  +  n42 * m21  +  n43 * m31  +  m41
    nm[10] = n41 * m12  +  n42 * m22  +  n43 * m32  +  m42
    nm[11] = n41 * m13  +  n42 * m23  +  n43 * m33  +  m43

    return nm
}

// magnify - multiply each element of a 4x3 matrix by a scalar
//
// @param {array/mat43} rm - the receiving 4x3 matrix array
// @param {array} im - the immutable source 4x3 matrix array
// @param {number} v - the scalar value
// @returns {obj/lib/mat43} mat4333 lib object for chaining
function magnify(rm, im, v) {
    rm[0 ] = im[0 ] * v
    rm[1 ] = im[1 ] * v
    rm[2 ] = im[2 ] * v

    rm[3 ] = im[3 ] * v
    rm[4 ] = im[4 ] * v
    rm[5 ] = im[5 ] * v

    rm[6 ] = im[6 ] * v
    rm[7 ] = im[7 ] * v
    rm[8 ] = im[8 ] * v

    rm[9 ] = im[9 ] * v
    rm[10] = im[10] * v
    rm[11] = im[11] * v

    return this
}

// magnify - multiply each element of a 4x3 matrix by a scalar into a new 4x3 matrix array
//
// @param {array} im - an immutable source 4x3 matrix array
// @param {number} v - a scalar multiplicator
// @returns {array/mat43} created 4x3 matrix array with magnifcation results
function imagnify(im, v) {
    const nm = new Float32Array(12)

    nm[0 ] = im[0 ] * v
    nm[1 ] = im[1 ] * v
    nm[2 ] = im[2 ] * v

    nm[3 ] = im[3 ] * v
    nm[4 ] = im[4 ] * v
    nm[5 ] = im[5 ] * v

    nm[6 ] = im[6 ] * v
    nm[7 ] = im[7 ] * v
    nm[8 ] = im[8 ] * v

    nm[9 ] = im[9 ] * v
    nm[10] = im[10] * v
    nm[11] = im[11] * v

    return nm
}

// generates a perspective projection 4x3 matrix
//
// @param {number/degrees} fovy - the vertical field of view
// @param {number} aspectRate - the viewport width-to-height aspect ratio
// @param {number} zNear - the z coordinate of the near clipping plane
// @param {number} zFar - the z coordinate of the far clipping plane
function perspective(rm, fovy, aspectRate, zNear, zFar) {
    const f = 1 / Math.tan(.5 * fovy * DEG_TO_RAD)

    rm[0] = f / aspectRate
    rm[1] = rm[2] = rm[3] = 0
    rm[4] = f
    rm[5] = rm[6] = rm[7] = 0
    if (zFar) {
        const nf = 1 / (zNear - zFar)
        rm[8] = (zNear + zFar) * nf
        // rm[11] = -1  // TODO what can we do with this negative???
        rm[9] = rm[10] = 0
        rm[11] = 2 * zFar * zNear * nf
    } else {
        rm[8] = -1
        // rm[9] = -1
        rm[9] = rm[10] = 0
        rm[11] = -2 * zNear
    }
    // rm[12] = 0

    return rm
}


// generates a perspective projection 4x3 matrix
//
// @param {number/degrees} fovy - the vertical field of view
// @param {number} aspectRate - the viewport width-to-height aspect ratio
// @param {number} zNear - the z coordinate of the near clipping plane
// @param {number} zFar - the z coordinate of the far clipping plane
function iperspective(fovy, aspectRate, zNear, zFar) {
    const nm = new Float32Array(12),
          f = 1 / Math.tan(.5 * fovy * DEG_TO_RAD)

    nm[0] = f / aspectRate
    nm[4] = f
    if (zFar) {
        const nf = 1 / (zNear - zFar)
        nm[8] = (zNear + zFar) * nf
        // nm[11] = -1
        nm[11] = 2 * zFar * zNear * nf
    } else {
        nm[8] = -1
        // nm[11] = -1
        nm[11] = -2 * zNear
    }

    return nm
}

// set camera look at matrix
//
// @param {array/vec3} cam - the camera coordinates 3D vector
// @param {array/vec3} tar - the target coordinates 3D vector
// @param {array/vec3} up - the up camera orientation 3D vector (tilt)
// @returns {obj/lib/mat43} mat4333 lib object for chaining
function lookAt(rm, cam, tar, up) {
    const zAxis = math.vec3.inormalize( math.vec3.isub(cam, tar) )
    const xAxis = math.vec3.inormalize( math.vec3.icross(up, zAxis) )
    const yAxis = math.vec3.inormalize( math.vec3.icross(zAxis, xAxis) )

    setAxis(rm, xAxis, yAxis, zAxis, cam)

    return this
}

// generates camera look at matrix
//
// @param {array/vec3} cam - the camera coordinates 3D vector
// @param {array/vec3} tar - the target coordinates 3D vector
// @param {array/vec3} up - the up camera orientation 3D vector (tilt)
// @return {array/mat43} the look-at 4x3 matrix
function ilookAt(cam, tar, up) {
    const zAxis = math.vec3.inormalize( math.vec3.isub(cam, tar) )
    const xAxis = math.vec3.inormalize( math.vec3.icross(up, zAxis) )
    const yAxis = math.vec3.inormalize( math.vec3.icross(zAxis, xAxis) )

    return fromAxes(xAxis, yAxis, zAxis, cam)
}



// test if two 4x3 matrices have equal components
//
// @param {array/mat4/immutable} im1 - the first 4x3 matrix array
// @param {array/mat4/immutable} im2 - the second 4x3 matrix array
// @returns {boolean} true if matrix components are equal, false otherwise
function equals(im1, im2) {
    return (
           im1[0 ] === im2[0 ]
        && im1[1 ] === im2[1 ]
        && im1[2 ] === im2[2 ]

        && im1[3 ] === im2[3 ]
        && im1[4 ] === im2[4 ]
        && im1[5 ] === im2[5 ]

        && im1[6 ] === im2[6 ]
        && im1[7 ] === im2[7 ]
        && im1[8 ] === im2[8 ]

        && im1[9 ] === im2[9 ]
        && im1[10] === im2[10]
        && im1[11] === im2[11]
    )
}

// test if two 4x3 matrices have similar components to the precision of EPSILON
//
// @param {array/mat4/immutable} im1 - the first 4x3 matrix array
// @param {array/mat4/immutable} im2 - the second 4x3 matrix array
// @param {number} epsilon - the optional precision, collider.jam global EPSILON value is used when missing
// @returns {boolean} true if matrix components are similar, false otherwise
function near(im1, im2, epsilon) {
    const E = epsilon ?? EPSILON
    const m11 = im1[0 ], m12 = im1[1 ], m13 = im1[2 ],
          m21 = im1[3 ], m22 = im1[4 ], m23 = im1[5 ],
          m31 = im1[6 ], m32 = im1[7 ], m33 = im1[8 ],
          m41 = im1[9 ], m42 = im1[10], m43 = im1[11]

    const n11 = im1[0 ], n12 = im1[1 ], n13 = im1[2 ],
          n21 = im1[3 ], n22 = im1[4 ], n23 = im1[5 ],
          n31 = im1[6 ], n32 = im1[7 ], n33 = im1[8 ],
          n41 = im1[9 ], n42 = im1[10], n43 = im1[11]

    return (
           abs(m11 - n11) <= E * max(1.0, abs(m11), abs(n11))
        && abs(m12 - n12) <= E * max(1.0, abs(m12), abs(n12))
        && abs(m13 - n13) <= E * max(1.0, abs(m13), abs(n13))

        && abs(m21 - n21) <= E * max(1.0, abs(m21), abs(n21))
        && abs(m22 - n22) <= E * max(1.0, abs(m22), abs(n22))
        && abs(m23 - n23) <= E * max(1.0, abs(m23), abs(n23))

        && abs(m31 - n31) <= E * max(1.0, abs(m31), abs(n31))
        && abs(m32 - n32) <= E * max(1.0, abs(m32), abs(n32))
        && abs(m33 - n33) <= E * max(1.0, abs(m33), abs(n33))

        && abs(m41 - n41) <= E * max(1.0, abs(m41), abs(n41))
        && abs(m42 - n42) <= E * max(1.0, abs(m42), abs(n42))
        && abs(m43 - n43) <= E * max(1.0, abs(m43), abs(n43))
    )
}



// get a 4x3 matrix array string representation in the column-major order
//
// @param {array/mat4/immutable} im - the source 4x3 matrix array
// @returns {string} the 4x3 matrix array string representation
function str(im) {
    return `[\n${im[0]}\t${im[3]}\t${im[6]}\t${im[9 ]}\n`
            + `${im[1]}\t${im[4]}\t${im[7]}\t${im[10]}\n`
            + `${im[2]}\t${im[5]}\t${im[8]}\t${im[11]}\n]`
}

// get a 4x3 matrix array formatted in the column-major order
//
// @param {array/mat43/immutable} im - the source 4x3 matrix array
// @param {string} s - optional separator ("\t" by default)
// @param {string} d - optional line delimiter ("\n    " by default)
// @param {string} p - optional prefix ("[\n   ' by default)
// @param {string} x - optional suffix ("\n]" by default)
// @returns {string} the 4x3 matrix array string representation
function fmt(im, s, d, p, x) {
    s = s ?? '\t'
    d = d ?? '\n    '
    p = '[\n    '
    x = '\n]'
    return `${p}${d}`
               + `${im[0]}${s}${im[3]}${s}${im[6]}${s}${im[9 ]}${d}`
               + `${im[1]}${s}${im[4]}${s}${im[7]}${s}${im[10]}${d}`
               + `${im[2]}${s}${im[5]}${s}${im[8]}${s}${im[11]}${x}`
}

// get a 4x3 matrix array string dump (printed column-by-column in the array order)
//
// @param {array/mat43/immutable} im - the source 4x3 matrix array
// @returns {string} the 4x3 matrix array string dump
function dump(im) {
    return `mat43[\n    `
               + `${im[0]}, ${im[1 ]}, ${im[2 ]},    `
               + `${im[3]}, ${im[4 ]}, ${im[5 ]},    `
               + `${im[6]}, ${im[7 ]}, ${im[8 ]},    `
               + `${im[9]}, ${im[10]}, ${im[11]}]`
}


function mat43(v) {
    if (v === undefined) return create()
    if (isArr(v)) return clone(v)
    if (isNum(v)) return from.apply(this, arguments)
    return null
}

extend(mat43, {
    rx: create(),

    identity,
    create,
    xcreate,
    zero,
    izero,
    copy,
    clone,
    fromMat4,
    setMat4,
    setFromMat4,
    fromMat43R,
    setQuat,
    fromQuat,
    from,
    fromAxes,
    set,
    extractVec3,
    iextractVec3,

    add,
    iadd,
    sub,
    isub,
    mul,
    imul,
    magnify,
    imagnify,

    perspective,
    iperspective,
    lookAt,
    ilookAt,

    equals,
    near,
    str,
    fmt,
    dump,
})
math.mat43 = mat43
