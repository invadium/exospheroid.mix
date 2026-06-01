function unscrewScript(script) {
    if (!script || script.unscrewed) return 
    const { name, path, src, runes, dependencies } = script

    // unscrew dependencies first
    dependencies.forEach(d => unscrewByName(d))

    log(`unscrewing [${path}.up]: ` + runes)
    // unscrew runes without continuation
    // (e.g. don't preserve screw VM state between script executions)
    const res = lib.screw.unscrew( runes, false ) 
    if (isArray(res)) {
        script.geo = res
        script.createdGeometries = res.length
    }
    script.unscrewed = true
}

function unscrewByName(name) {
    const script = lib.geoLibrary.script[name]
    if (!script) throw new Error(`expect unknown script [${name}]`)

    unscrewScript(script)
}

function unscrewScripts(ls) {
    ls.forEach(s => unscrewScript(s))
}

function geometry() {

    unscrewScripts(lib.geoLibrary.script._ls)

    // generate meshes
    const sd = lib.screw.screwdriver

    /*
    // here we screw up some meshes
    sd.gen().cube().push(.5).scale().randomColors()
    // bake the mesh
    sd.push('cubeOne').label().bake()

    // here we screw up some meshes
    sd.gen().cube().push(.8).scale().randomColors()
    // bake the mesh
    sd.push('cubeTwo').label().bake()
    */

    // lib.screw.unscrew.setLibrary(lib.geoLibrary)
    // lib.screw.unscrew( lib.screw.screwUp(lib.screwUp.cube) )
    // lib.screw.unscrew( lib.screw.screwUp(lib.screwUp.octahedron) )

    // const r2 = lib.screw.screwUp(lib.screwUp.simple)
    // lib.screw.unscrew(r2)

    log('=== paint colorless meshes ===')
    const glib = lib.geoLibrary
    const colorlessMeshes = glib.mesh._ls.filter(g => !g.colors)

    colorlessMeshes.forEach(g => {
        log(' * random coloring mesh: ' + g.name)
        dir(g)
        if (!g.colors) {
            g.colors = []
            sd.next( g ).randomColors().bake()
        }
    })

    /*
    g = lib.geoLibrary.mesh.selectOne('octahedron')
    g.colors = []
    sd.next( g ).randomColors().bake()

    g = lib.geoLibrary.mesh.selectOne('mod-octahedron')
    g.colors = []
    sd.next( g ).randomColors().bake()

    g = lib.geoLibrary.mesh.selectOne('monoTriangle')
    g.colors = []
    sd.next( g ).randomColors().bake()
    */

    // const res2 = lib.screw.unscrew.unscrewOne(runes)
    // dir(res2)
}
geometry.Z = 11
