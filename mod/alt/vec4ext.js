function _x2d(x) {
    let d = x.charCodeAt(0) - 48
    return d > 9? d - 7 : d
}

function __rgb__(hex) {
    if (hex.startsWith('#')) hex = hex.substring(1)
    const d = hex.toUpperCase().split('').map(c => _x2d(c))
    return math.vec4.create((16*d[0]+d[1])/255, (16*d[2]+d[3])/255, (16*d[4]+d[5])/255, 1)
}

function __rgba__(hex) {
    if (hex.startsWith('#')) hex = hex.substring(1)
    const d = hex.toUpperCase().split('').map(c => _x2d(c))
    return math.vec4.create((16*d[0]+d[1])/255, (16*d[2]+d[3])/255, (16*d[4]+d[5])/255, (16*d[6]+d[7])/255)
}

const vec4ext = {
    rgb: __rgb__,
    rgba: __rgba__,
}
