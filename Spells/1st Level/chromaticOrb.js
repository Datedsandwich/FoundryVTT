if (args[0].tag === 'OnUse') {
    const damageTypeToAnimation = {
        acid: 'jb2a.fire_bolt.green',
        cold: 'jb2a.fire_bolt.blue',
        fire: 'jb2a.fire_bolt.orange',
        lightning: 'jb2a.lightning_bolt.narrow.blue',
        poison: 'jb2a.fire_bolt.green',
        thunder: 'jb2a.fire_bolt.blue',
    }

    const casterToken = await fromUuid(args[0].tokenUuid)
    const caster = casterToken.actor

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
        .reachTowards(args[0].targets[0])
        .missed(args[0].hitTargets.length === 0)
        .play()

    if (args[0].hitTargets.length === 0) return

    const target = canvas.tokens.get(args[0].hitTargets[0].id)
    const numDice = args[0].spellLevel + 2
    const damageRoll = args[0].isCritical
        ? await new Roll(`${numDice}d8 + ${numDice * 8}`).evaluate({
              async: true,
          }) // This is how crits are handled in my game
        : await new Roll(`${numDice}d8`).evaluate({ async: true })

    new MidiQOL.DamageOnlyWorkflow(
        caster,
        casterToken,
        damageRoll.total,
        damageType,
        [target],
        damageRoll,
        {
            flavor: `(${CONFIG.DND5E.damageTypes[damageType]})`,
            itemCardId: args[0].itemCardId,
        }
    )
}
