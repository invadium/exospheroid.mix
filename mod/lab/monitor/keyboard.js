/*
 * Keyboard actions monitor listens to keyboard events and emits mapped actions to actions controller
 *
 * @expect keyboard actions to be mapped in the ```env.bind.keyboardControllersMapping```.
 * @expect controller monitor to be available at ```lab/monitor/controller```.
 */

const controller = require('lab/monitor/controller')

// initialize keyboard actions
function init() {
    // register keyboard events
    trap.on('keyDown', (e) => {
        if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return

        const controllerAction = env.bind.keyCodeActionMap[e.code]
        if (controllerAction) {
            controller.act(controllerAction, e)
        }
    })
    trap.on('keyUp', (e) => {
        if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return

        const controllerAction = env.bind.keyCodeActionMap[e.code]
        if (controllerAction) {
            controller.cutOff(controllerAction, e)
        }
    })
}
