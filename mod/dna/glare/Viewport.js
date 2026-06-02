class Viewport extends sys.LabFrame {

    constructor(st) {
        super( augment({
            name: 'port',

            x:     0,
            y:     0,
            w:     0,
            h:     0,

            outline: {
                hidden: false,
                width:  2,
                color:  hsl( .55, .55, .55),
            },

            clip:  true,
        }, st) )
    }

    draw() {
        const { x, y, w, h, outline } = this

        // define and clip the viewport
        glow.viewport(x, y, w, h)
        glow.clear()
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
