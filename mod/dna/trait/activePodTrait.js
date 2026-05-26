function activate() {
    const __    = this.__
    const alias = this.alias

    if (__[alias]) {
        __[alias].deactivate()
    }
    __[alias] = this
    this.disabled = false
    if (isFun(this.onActivate)) this.onActivate()
}

function deactivate() {
    const __    = this.__
    const alias = this.alias

    if (!this.disabled || __[alias] !== this) {
        this.disabled = true
        __[alias] = null
        if (isFun(this.onDeactivate)) this.onDeactivate()
    }
}

function activateNext() {
    const __    = this.__
    const ls    = __._ls
    const alias = this.alias

    let nextNode
    for (let i = ls.indexOf(this) + 1; i < ls.length; i++) {
        const e = ls[i]
        if (e !== this && e.alias === alias) {
            nextNode = e
            break
        }
    }
    if (!nextNode) {
        for (let i = 0; i < ls.length; i++) {
            const e = ls[i]
            if (e !== this && e.alias === alias) {
                nextNode = e
                break
            }
        }
    }
    if (!nextNode) return

    nextNode.activate()
}

function activatePrev() {
    const __    = this.__
    const ls    = __._ls
    const alias = this.alias

    let nextNode
    for (let i = ls.indexOf(this) - 1; i >= 0; i--) {
        const e = ls[i]
        if (e !== this && e.alias === alias) {
            nextNode = e
            break
        }
    }
    if (!nextNode) {
        for (let i = ls.length - 1; i >= 0; i--) {
            const e = ls[i]
            if (e !== this && e.alias === alias) {
                nextNode = e
                break
            }
        }
    }
    if (!nextNode) return

    nextNode.activate()
}
