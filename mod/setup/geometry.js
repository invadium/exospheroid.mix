function geometry() {
    // generate meshes
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
    lib.screw.unscrew.setLibrary(lib.geo)

    lib.screw.unscrew( lib.screw.screwUp(lib.screwUp.cube) )
    lib.screw.unscrew( lib.screw.screwUp(lib.screwUp.octahedron) )

    // const r2 = lib.screw.screwUp(lib.screwUp.simple)
    // lib.screw.unscrew(r2)
    
    let g = lib.geo.glib['cubeOne']
    g.colors = []
    mesh.next( g ).randomColors().bake()

    g = lib.geo.glib['octahedron']
    g.colors = []
    mesh.next( g ).randomColors().bake()

    // const res2 = lib.screw.unscrew.unscrewOne(runes)
    // dir(res2)
}
geometry.Z = 11
