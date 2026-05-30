function evo(dt) {
    const spinner = lab.port.spinner
    if (!spinner) return

    const shape = spinner.getTargetShape()

    if (!shape) {
        debugger
    }
    pin.info.set('target', '#' + spinner.target + '--' + shape.name)
}
