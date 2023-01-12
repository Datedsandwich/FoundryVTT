if (args[0].tag === 'OnUse') {
    if (args[0].hitTargets.length === 0) return
    const sourceToken = await fromUuid(args[0].tokenUuid)
    const source = sourceToken.actor

    const { faces, number } = args[0].damageRoll.terms[6]

    const maxNecroticDamageRoll = faces * number

    let necroticDamage =
        args[0].damageDetail.find((damage) => damage.type === 'necrotic')
            ?.damage ?? 0

    if (args[0].isCritical) {
        necroticDamage += maxNecroticDamageRoll
    }

    let damageRoll = await new Roll(`${necroticDamage}`).roll()

    new MidiQOL.DamageOnlyWorkflow(
        source,
        sourceToken,
        damageRoll.total,
        'healing',
        [sourceToken],
        damageRoll,
        {
            flavor: `${args[0].item.name} - Healing`,
            itemCardId: args[0].itemCardId,
        }
    )
}
