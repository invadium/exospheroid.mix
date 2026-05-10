function up(src) {
    // make sure we have the geo library
    if (!lib.geoLibrary) {
        lib.attach( new dna.geo.GeoLibrary() )
    }
    lib.screw.unscrew.setLibrary(lib.geoLibrary)

    const runes = lib.screw.screwUp(src)
    log('runes: ' + runes)
    lib.screw.unscrew( runes )

    return (
        '=====================================================\n'
        + runes
        + '\n=====================================================\n'
        + src
    )
}
