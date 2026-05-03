function wireframe(args, line, con) {
    const Surface = dna.geo.Surface

    log('looking for surfaces...')
    lab.port.applyAll(e => {
        dir(e)
        e.renderOpt[Surface.OPT_WIREFRAME] = 1
    }, e => e instanceof Surface)

    con.hide()
}
