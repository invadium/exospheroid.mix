/*
 * Information node.
 */

const df = {
    name:       'info',
    color:      '#ffffff',
    background: '#00000080',
    margin:     8,
    rx:         0,
    ry:         0,
}

class Info {

    constructor(st) {
        extend(this, df, st)
        this.keys = {}
        this.icons = {}
    }

    set(key, msg, icon) {
        this.keys[key] = msg
        this.icons[key] = icon
        if (msg == undefined) delete this.keys[key]
    }

    seti(key, msg, icon) {
        if (isNum(msg)) msg = round(msg * 10)/10
        this.keys[key] = msg
        this.icons[key] = icon
        if (msg === null || msg === undefined) delete this.keys[key]
    }

    setAll(st) {
        if (!st) return

        const keys = this.keys
        Object.keys(st).forEach(k => {
            keys[k] = st[k]
        })
    }

    isSet(key) {
        return !!(this.keys[key])
    }

    reset() {
        this.keys = {}
    }

    draw() {
        const keys = Object.keys(this.keys)
        const N = keys.length
        if (N === 0) return

        const f = env.style.font.info
        const H = N * f.size + (N + 1) * this.margin
        const X = rx(this.rx)
        const Y = ry(this.ry)
        const W = this.maxTW || ctx.width * .25

        fill(this.background)
        rect(X, Y, W, H)

        baseTop()
        alignLeft()
        fill(this.color)
        font(f.size + 'px ' + f.family)

        let maxTW = 0
        let x = X + this.margin
        let y = Y + this.margin
        for (let i = 0; i < N; i++) {
            const k = keys[i]
            const v = this.keys[k]
            const icon = this.icons[k]
            const label = k + ': ' + v
            let tw = 2*this.margin + textWidth(label)
            if (icon) {
                image(icon, x, y, f.size, f.size)
                text(label, x + f.size + this.margin, y)
                tw += f.size + this.margin
            } else {
                text(label, x, y)
            }
            if (tw > maxTW) maxTW = tw
            y += (f.size + this.margin)
        }
        this.maxTW = maxTW
    }
}
