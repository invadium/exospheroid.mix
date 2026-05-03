function nextProg(args, line, con) {

    const programs = [ 'flat', 'plainColor' ]
    const ls = lib.glsl.zprog._ls.filter(p => programs.includes(p.name))

    let cur = ls.indexOf(lab.port.prog)
    cur ++
    if (cur >= ls.length) cur = 0

    lab.port.prog = ls[cur]


    con.hide()
}
nextProg.info = 'switch root WebGL program'
