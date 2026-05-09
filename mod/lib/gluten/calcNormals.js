function calcNormals(v, smooth) {
    const n = [], w = [], gn = [], gN = []

    function indexVertex(vx, j, nv) {
        let o = -1, i = 0
        while(o < 0 && i < j) {
            let vw = vec3.fromArray(v, i)
            if (vec3.equals(vx, vw)) {
                // found the leading vertex!
                o = i/3
            }
            i += 3
        }

        let wj = j/3
        w[wj] = o
        if (o < 0) o = wj

        if (gn[o]) {
            gn[o].push(nv)
        } else gn[o] = [nv]
    }

    function avgNormal(nlist) {
        const v = vec3.izero()
        nlist.forEach(w => vec3.add(v, w))
        vec3.scale(v, 1/nlist.length)
        vec3.normalize(v, v)
        return v
    }

    for (let i = 0; i < v.length; i+=9) {
        let
            v1 = vec3.fromArray(v, i),
            v2 = vec3.fromArray(v, i + 3),
            v3 = vec3.fromArray(v, i + 6),
            v12 = vec3.isub(v1, v2),
            v13 = vec3.isub(v1, v3),
            // calculate the normal for the triangle
            nv = vec3.icross(v12, v13)

        // make sure the normal is normalized
        vec3.normalize(nv, nv)

        if (smooth) {
            indexVertex(v1, i,     nv)
            indexVertex(v2, i + 3, nv)
            indexVertex(v3, i + 6, nv)
        }

        // push the same normal for all 3 vertices
        n.push(nv[0], nv[1], nv[2])
        n.push(nv[0], nv[1], nv[2])
        n.push(nv[0], nv[1], nv[2])
    }

    if (smooth) {
        for (let i = 0; i < w.length; i++) {
            const leadIndex = w[i]

            let an
            if (leadIndex < 0) {
                an = avgNormal(gn[i]) 
                gN[i] = an
            } else {
                an = gN[leadIndex]
            }

            n[i*3]   = an[0]
            n[i*3+1] = an[1]
            n[i*3+2] = an[2]
        }
    }

    return n
}
