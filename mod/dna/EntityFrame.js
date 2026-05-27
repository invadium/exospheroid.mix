// a lab frame with convenient _traits and _pods installation routines in the constructor
// TODO refactor it out - a regular lab frame should do the trick for the most part
class EntityFrame extends sys.LabFrame {

    constructor(st) {
        super(st)

        const _ = this

        // install trails if present
        if (st && st._traits) st._traits.forEach(t => {
            trait(_, t)
        })

        // install pods if present
        if (st && st._pods) {
            st._pods.forEach(pod => {
                _.attach(pod)
            })
        }
    }

}
