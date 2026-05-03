// a lab frame with convenient _traits and _pods installation routines in the constructor
class EntityFrame extends sys.LabFrame {

    constructor(st) {
        super(st)

        const _ = this

        // install trails if present
        if (st && st._traits) st._traits.forEach(trait => {
            extend(_, trait, p => p !== 'name' && p !== 'onExtend' && !p.startsWith('_'))
            //if (trait.__onTrait) trait.__onTrait.call(_))
        })

        // install pods if present
        if (st && st._pods) {
            st._pods.forEach(pod => {
                _.attach(pod)
            })
        }
    }

}
