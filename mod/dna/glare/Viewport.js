class Viewport extends sys.LabFrame {

    constructor(st) {
        super( augment({
            name: 'port',

            x:     0,
            y:     0,
            w:     0,
            h:     0,
            cam:   null,

            outline: {
                hidden: false,
                width:  2,
                color:  hsl( .55, .55, .55),
            },

            clip:  true,
        }, st) )
    }

    draw() {
        const { x, y, w, h, cam, outline } = this

        // define and clip the viewport
        glow.viewport(x, y, w, h)
        glow.clear()

        // init view matrix
        glow.useView()
        glow.identity()
        if (cam) {
            glow.setMatrix( cam.viewMatrix() )
            // glow.perspective(30, w/h, 1, 256)
        }
        // debug move
        // glow.view[11] = env.time * 8

        // init model matrix
        glow.useModel()
        glow.identity()

        super.draw()

        // complete rendering and restore the rendering context to the initial state
        glow.flush()         

        if (!outline.hidden) {
            lineWidth( outline.width )
            stroke( outline.color )
            rect(x, y, w, h)
        }
    }

}
