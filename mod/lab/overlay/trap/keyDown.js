function handleOpt(e) {

    switch(e.code) {
        case 'KeyB':
            signal('nextProg')
            signal('nextOpt')
            break
    }

}

function keyDown(e) {
    if (e.ctrlKey) handleOpt(e)
}
