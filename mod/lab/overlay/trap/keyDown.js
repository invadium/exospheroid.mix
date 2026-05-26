function handleOpt(e) {

    switch(e.code) {
        case 'KeyV':
            const cam = lab.port.cam
            cam.controller.activateNext()
            if (cam.controller.name === 'orbitalController') {
                // move camera back a little
                cam.pos[1] = 4
                cam.pos[2] = 16
                cam.dir[1] = .2

                cam.lookAt(pin.target)
            }
            break
        case 'KeyB':
            signal('nextProg')
            signal('nextOpt')
            break
    }

}

function keyDown(e) {
    if (e.ctrlKey) handleOpt(e)
}
