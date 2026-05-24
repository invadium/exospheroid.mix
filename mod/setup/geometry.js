function geometry() {

    // generate meshes
    const sd = lib.screw.screwdriver

    // here we screw up some meshes
    sd.gen().cube().push(.5).scale().randomColors()
    // bake the mesh
    sd.push('cube').label().bake()

    // lib.screw.unscrew.setLibrary(lib.geoLibrary)
    // lib.screw.unscrew( lib.screw.screwUp(lib.screwUp.cube) )
    // lib.screw.unscrew( lib.screw.screwUp(lib.screwUp.octahedron) )

    // const r2 = lib.screw.screwUp(lib.screwUp.simple)
    // lib.screw.unscrew(r2)
    
    let g = lib.geoLibrary.mesh.selectOne('cubeOne')
    g.colors = []
    sd.next( g ).randomColors().bake()

    g = lib.geoLibrary.mesh.selectOne('octahedron')
    g.colors = []
    sd.next( g ).randomColors().bake()

    // const res2 = lib.screw.unscrew.unscrewOne(runes)
    // dir(res2)
}
geometry.Z = 11
