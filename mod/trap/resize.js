function resize() {
    const state = lab.control.state.leadNode()

    if (state) {
        if (isFun(state.resize)) state.resize()
        if (state.trap && isFun(state.trap.resize)) state.trap.resize()
    }
}
