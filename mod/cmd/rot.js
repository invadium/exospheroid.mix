function rot(args, line, con) {
    const target = pin.target
    if (!target) {
        con.print("can't fint the target!")
        return
    }

    const rotX = expect( Number(args[1]) ).isNumber().value()
    const rotY = expect( Number(args[2]) ).isNumber().value()
    const rotZ = expect( Number(args[3]) ).isNumber().value()

    con.print(`${rotX}:${rotY}:${rotZ}`)
    target.rotSpeed[0] = rotX
    target.rotSpeed[1] = rotY
    target.rotSpeed[2] = rotZ

    con.hide()
}
rot.usage = '[ rotX, rotY, rotZ ]'
rot.info = 'set target rotation'
