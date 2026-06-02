// represents a collection of meshes, materials and associated user data 
//
// Naming:
// * Geo
// * Model
// * Shape
// * Primitive
class GeoLibrary extends sys.Frame {

    constructor(st) {
        super( augment({
            name: 'glib',

            // cur:  null,  // TODO do we need that one for anything?
        }, st) )
        this.touch('mesh', {
            _attachPolicy: sys.Frame.REPLACE,
        })
        this.touch('material', {
            _attachPolicy: sys.Frame.REPLACE,
        })
        this.touch('data', {
            _attachPolicy: sys.Frame.REPLACE,
        })
        this.touch('script', {
            _attachPolicy: sys.Frame.REPLACE,
        })
    }

    attachMesh(mesh) {
        this.mesh.attach( mesh )
    }

    attachMaterial(mat) {
        this.material.attach( mat )
    }

    attachData(dat) {
        this.data.attach( dat )
    }

    dumpMeshes() {
        this.mesh._ls.forEach(g => {
            log('    * ' + g.name)
        })
    }

}
