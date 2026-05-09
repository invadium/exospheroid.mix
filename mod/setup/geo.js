function geo() {
    const mesh = lib.screw.mesh

    // here we screw up some meshes
    mesh.gen().cube().push(.5).scale().randomColors()
    // bake the mesh
    mesh.push('cube').label().bake()

    // lets try to use the screwup compiler
    // TODO something is off with the compile-decompile sequence
    //      it definitelly executes the runes,
    //      but never gets into the brew/bake routine
    //      presumably because of the bytecode mismatch
    //      after heavy js13k optimizations
    const runes = lib.screw.screwUp(lib.screwUp.shape)

    lib.screw.unscrew.setLibrary(lib.geo)
    const res = lib.screw.unscrew(runes)
    
    const g = lib.geo.glib['mod-octahedron']
    g.colors = []
    mesh.next( lib.geo.glib['mod-octahedron'] ).randomColors().bake()

    // const res2 = lib.screw.unscrew.unscrewOne(runes)
    // dir(res2)
}
geo.Z = 11
