function wireframe() {
    const Surface = dna.geo.Surface

    lab.port.applyAll(e => {
        e.renderOpt[Surface.OPT_WIREFRAME] = 1
    }, e => e instanceof Surface)
}
