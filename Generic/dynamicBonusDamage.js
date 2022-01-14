// Made for a user on reddit who needed help, will read the damage value of the weapon and apply secondary damage based on the number rolled.

if (args[0].tag === 'OnUse') {
    if (args[0].hitTargets.length < 1) return

    const damageTypes = ['piercing', 'acid', 'necrotic', 'fire', 'poison', 'psychic', 'thunder', 'lightning', 'radiant', 'force']

    const sourceToken = await fromUuid(args[0].tokenUuid);
    const source = sourceToken.actor;

    const target = canvas.tokens.get(args[0].hitTargets[0].id);

    const rawResult = args[0].damageRoll.dice[0].results[0].result
    const bonusDamageType = damageTypes[rawResult - 1]
    const bonusDamageRoll = await new Roll('2d8').evaluate({ async: true })

    new MidiQOL.DamageOnlyWorkflow(source, sourceToken, bonusDamageRoll.total, bonusDamageType, [target], bonusDamageRoll, {
        flavor: `(${CONFIG.DND5E.damageTypes[bonusDamageType]})`,
        itemCardId: args[0].itemCardId
    });
}