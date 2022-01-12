if (args[0].tag === "OnUse") {
    if (args[0].failedSaves.length === 0) return // They didn't fail the save, no need to run anything else

    const casterToken = await fromUuid(args[0].tokenUuid);
    const caster = casterToken.actor;

    const target = canvas.tokens.get(args[0].failedSaves[0].id);
    const characterLevel = caster.data.type === "character" ? caster.data.data.details.level : casterToken.actor.data.data.details.cr;
    const numDice = 1 + (Math.floor((characterLevel + 1) / 6));
    const damageRoll = target.actor.data.data.attributes.hp.value < target.actor.data.data.attributes.hp.max
        ? await new Roll(`${numDice}d12`).evaluate({ async: true })
        : await new Roll(`${numDice}d8`).evaluate({ async: true });

    new MidiQOL.DamageOnlyWorkflow(caster, casterToken, damageRoll.total, 'necrotic', [target], damageRoll, {
        flavor: `(${CONFIG.DND5E.damageTypes['necrotic']})`,
        itemCardId: args[0].itemCardId
    });
}