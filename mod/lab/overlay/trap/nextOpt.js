function nextOpt() {
    const Surface = dna.shape.Surface

    lab.port.applyAll(e => {
        e.renderOpt[Surface.OPT_WIREFRAME] = ( e.renderOpt[Surface.OPT_WIREFRAME]? 0 : 1 )
    }, e => e instanceof Surface)
}
