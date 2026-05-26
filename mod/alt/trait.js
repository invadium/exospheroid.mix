function trait(tar, trait) {
    extend(tar, trait, p => p !== 'name' && p !== 'onTrait' && !p.startsWith('_'))
    if (isFun(trait.onTrait)) {
        trait.onTrait(tar)
    }
}
