function up(src, name, path) {
    // make sure we have the geo library
    if (!lib.geoLibrary) {
        lib.attach( new dna.geo.GeoLibrary() )
        lib.screw.unscrew.setLibrary(lib.geoLibrary)
    }

    // screw up the screw script source into a rune
    const runes = lib.screw.screwUp(src)

    log(`unscrewing [${path}.up]: ` + runes)
    // unscrew runes without continuation
    // (e.g. don't preserve screw VM state between script executions)
    lib.screw.unscrew( runes, false ) 

    return (
        '=====================================================\n'
        + runes
        + '\n=====================================================\n'
        + src
    )
}
