// screw vm operation codes reference table
//
// === How to Extend ===
//       * include the operator function into the ops array in unscrew (future screwdriver)
//       * insert the op name in the ops.ref manifest at the matching position (== ops array index) => must be indexed automatically
// TODO derive from ops definition
const ref = [
    // mnemonics
    'neogeo',
    'drop',
    'swap',
    'dup',
    'over',
    'mpush',
    'mpop',
    'buf',
    'unbuf',
    'place',

    'PI',
    'HPI',
    'TAU',
    'add',
    'sub',
    'mul',
    'div',
    'sin',
    'cos',
    'tan',
    'asin',
    'acos',
    'atan',
    'atan2',
    'precision',
    'smooth',
    'sharp',

    // modifiers
    'mid',
    'mscale',
    'translate',
    'mrotX',
    'mrotY',
    'mrotZ',
    'reflectX',
    'reflectY',
    'reflectZ',
    'scale',
    'stretch',
    'discardNegativeX',
    'discardNegativeY',
    'discardNegativeZ',

    // geometry assemblers
    'tri',
    'tuv',
    'mt',           // define the material

    'quad',
    'cube',
    'sphere',
    'circle',
    'tube',
    'cylinder',

    // finalizer
    'bounds',
    'dat',
    'name',
    'tag',
    'brew',
    'brewWires',

    // debug ones -- TODO ???
    //'ring',
    //'tetrahedron',
    //'cone',
    'dump',
    'halt',
    //'dumpv',

    // ghost codes with special implementation
    // [!] not in the VMs ops manifest
    'pushs',
    'def',
    'end',
    'call',

    'push1i',
    'push1f',
    'push1d',
    'push1u',

    'push2i',
    'push2f',
    'push2d',
    'push2u',

    'push3i',
    'push3f',
    'push3d',
    'push3u',

    'push4i',
    'push4f',
    'push4d',
    'push4u',

    'push1iv',
    'push1fv',
    'push1dv',
    'push1uv',

    'push2iv',
    'push2fv',
    'push2dv',
    'push2uv',

    'push3iv',
    'push3fv',
    'push3dv',
    'push3uv',

    'push4iv',
    'push4fv',
    'push4dv',
    'push4uv',
]

const PUSHS = ref.indexOf('pushs')
const DEF   = ref.indexOf('def')
const END   = ref.indexOf('end')
const CALL  = ref.indexOf('call')

// markers
const PUSH_VVV = ref.indexOf('push1i')
const SPECIAL  = PUSHS

// screw script mnemonics catalog - every single opcode up to "pushs"
const mnemonics = ref.slice(0, SPECIAL)

if (typeof module !== 'undefined') {
    module.exports = {
        ref,
        mnemonics,

        SPECIAL,
        PUSHS,
        DEF,
        END,
        CALL,
        PUSH_VVV,
    }
}
