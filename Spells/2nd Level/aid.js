if (args[0].tag === "OnUse") {
    if (args[0].hitTargets.length === 0) return;

    const hpBonus = 5 * (args[0].spellLevel - 1)

    args[0].hitTargets.forEach(async target => {
        await target.actor.applyDamage(-hpBonus)
    })
}