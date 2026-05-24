function flat() {
    const Surface = dna.shape.Surface

    lab.port.applyAll(e => {
        e.renderOpt[Surface.OPT_WIREFRAME] = 0
    }, e => e instanceof Surface)
}
