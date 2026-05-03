function stateDispatch(name, e) {
    const state = lab.control.state.leadNode()
    if (state) {
        if (state.trap && isFun(state.trap[name])) state.trap[name](e)
    }
}
