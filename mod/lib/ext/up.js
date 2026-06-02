function parseDependencies(src) {
    return src.split('\n').filter(s => s.startsWith('#depends')).map(s => s.substring(8).trim())
}

function up(src, name, path) {
    // make sure we have the geo library
    if (!lib.glib) {
        lib.attach( new dna.geo.GeoLibrary() )
        lib.screw.unscrew.setLibrary(lib.glib)
    }

    // screw up the screw script source into a rune
    const runes = lib.screw.screwUp(src)

    const dependencies = parseDependencies(src)

    // log(`unscrewing [${path}.up]: ` + runes)
    // unscrew runes without continuation
    // (e.g. don't preserve screw VM state between script executions)
    // lib.screw.unscrew( runes, false ) 
    
    // schedule for unscrew
    lib.glib.script.attach({
        name,
        path,
        src,
        runes,
        dependencies,
    })

    return (
        '=====================================================\n'
        + `${runes.length} bytes rune\n`
        + '-----------------------------------------------------\n'
        + runes
        + '\n=====================================================\n'
        + src
    )
}
