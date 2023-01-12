if (args[0].macroPass === 'preDamageRoll') {
    let damageTypeOptions = {
        buttons: [
            { label: 'Fire', value: 'fire' },
            { label: 'Radiant', value: 'radiant' },
        ],
    }

    const damageType = await warpgate.buttonDialog(damageTypeOptions, 'row')

    if (args[0].hitTargets.length === 0) return

    const theItem = await fromUuid(args[0].uuid)

    theItem.system.damage.parts[0][1] = damageType
}
