function lookAt(node) {
    if (!node) return
    const cam = pin.cam
    if (cam.controller.name !== 'orbitalController') return

    cam.lookAt(node.pos ?? node)
}
