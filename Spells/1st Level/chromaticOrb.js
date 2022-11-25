if (args[0].macroPass === 'preDamageRoll') {
    const damageTypeToAnimation = {
        acid: 'jb2a.fire_bolt.green',
        cold: 'jb2a.fire_bolt.blue',
        fire: 'jb2a.fire_bolt.orange',
        lightning: 'jb2a.lightning_bolt.narrow.blue',
        poison: 'jb2a.fire_bolt.green',
        thunder: 'jb2a.fire_bolt.blue',
    }

    const casterToken = await fromUuid(args[0].tokenUuid)

    let damageTypeOptions = {
        buttons: [
            { label: 'Acid', value: 'acid' },
            { label: 'Cold', value: 'cold' },
            { label: 'Fire', value: 'fire' },
            { label: 'Lightning', value: 'lightning' },
            { label: 'Poison', value: 'poison' },
            { label: 'Thunder', value: 'thunder' },
        ],
    }

    const damageType = await warpgate.buttonDialog(damageTypeOptions, 'row')

    new Sequence('Datedsandwich Macros')
        .effect()
        .file(damageTypeToAnimation[damageType])
        .atLocation(casterToken)
        .stretchTo(args[0].targets[0])
        .missed(args[0].hitTargets.length === 0)
        .play()

    if (args[0].hitTargets.length === 0) return

    const theItem = await fromUuid(args[0].uuid)

    theItem.system.damage.parts[0][1] = damageType
}
