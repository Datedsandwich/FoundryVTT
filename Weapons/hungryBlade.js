if (args[0].tag === 'OnUse') {
    if (args[0].hitTargets.length === 0) return
    const sourceToken = await fromUuid(args[0].tokenUuid)
    const source = sourceToken.actor

    const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1)

    const classes = Object.values(args[0].actor.data.classes)

    const hitDiceButtons = classes
        .filter(({ hitDiceUsed, levels }) => hitDiceUsed < levels)
        .map(({ identifier, hitDice }) => ({
            label: capitalise(identifier),
            value: {
                identifier,
                hitDice,
            },
        }))

    if (hitDiceButtons?.length < 1) return

    let hungryBladeOptions = {
        title: 'Use Hit Die?',
        buttons: [
            ...hitDiceButtons,
            { label: "Don't use Hit Die", value: null },
        ],
    }

    const hitDie = await warpgate.buttonDialog(hungryBladeOptions, 'row')

    if (!hitDie) return

    const classItem = [...args[0].actor.items].find(
        (item) => item.identifier === hitDie.identifier
    )

    if (!classItem) return

    await classItem.update({
        'data.hitDiceUsed': classItem.data.data.hitDiceUsed + 1,
    })

    const target = await fromUuid(args[0].hitTargetUuids[0] ?? '')
    const damageRoll = await new Roll(
        `${hitDie.hitDice} + ${args[0].actor?.data?.abilities?.con?.mod}`
    ).roll()

    new MidiQOL.DamageOnlyWorkflow(
        source,
        sourceToken,
        damageRoll.total,
        'necrotic',
        target ? [target] : null,
        damageRoll,
        {
            flavor: `${args[0].item.name} - Necrotic Damage`,
            itemCardId: args[0].itemCardId,
        }
    )

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
