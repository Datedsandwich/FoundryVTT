if (args[0].tag === 'OnUse') {
    if (args[0].hitTargets.length === 0) return

    const sourceToken = await fromUuid(args[0].tokenUuid)
    const source = sourceToken.actor
    const target = canvas.tokens.get(args[0].hitTargets[0].id)

    const isDragon = (target.actor.data.data.details?.type?.value || '')
        .toLowerCase()
        .includes('dragon')

    if (isDragon) {
        const damageRoll = await new Roll('3d6').roll({ async: true })
        const damageType = args[0].damageDetail[0].type
        new MidiQOL.DamageOnlyWorkflow(
            source,
            sourceToken,
            damageRoll.total,
            damageType,
            [target],
            damageRoll,
            {
                flavor: `Dragon Slayer (${damageType})`,
                damageList: args[0].damageList,
                pressedKeys: { rollToggle: false },
                itemCardId: args[0].itemCardId,
            }
        )
    }
}
