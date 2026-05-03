function geo() {
    const mesh = lib.screw.mesh

    // here we screw up some meshes
    mesh.gen().cube().push(.5).scale()

    //for (let i = 0; i < 72; i++) {
    for (let i = 0; i < 36; i++) {
        mesh.colors([rnd(), rnd(), rnd()])
    }

    // bake the mesh
    mesh.push('cube').label().bake()
}
geo.Z = 11
