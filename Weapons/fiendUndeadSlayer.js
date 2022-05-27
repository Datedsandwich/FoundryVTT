// for Mace of Disruption, Holy Avenger, etc.

if (args[0].tag === 'OnUse') {
    if (args[0].hitTargets.length === 0) return

    const sourceToken = await fromUuid(args[0].tokenUuid)
    const source = sourceToken.actor
    const target = canvas.tokens.get(args[0].hitTargets[0].id)

    const isFiendOrUndead = ['fiend', 'undead'].some((type) =>
        (target.actor.data.data.details?.type?.value || '')
            .toLowerCase()
            .includes(type)
    )

    if (isFiendOrUndead) {
        const damageRoll = await new Roll('2d6').roll({ async: true })
        const damageType = 'radiant'
        new MidiQOL.DamageOnlyWorkflow(
            source,
            sourceToken,
            damageRoll.total,
            damageType,
            [target],
            damageRoll,
            {
                flavor: `Unholy Slayer (${damageType})`,
                damageList: args[0].damageList,
                itemCardId: args[0].itemCardId,
            }
        )
    }
}
