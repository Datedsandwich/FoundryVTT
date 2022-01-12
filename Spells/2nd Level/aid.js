if (args[0].tag === "OnUse") {
    if (args[0].hitTargets.length === 0) return;

    const deleteHook = "deleteActiveEffect"

    const hpBonus = 5 * (args[0].spellLevel - 1)

    args[0].hitTargets.forEach(async target => {
        const updates = {
            actor: {
                'data.attributes.hp.value': target.actor.data.data.attributes.hp.value + hpBonus
            }
        }

        await warpgate.mutate(target, updates, {}, { name: `aid` });

            async function removeHealth(effect) {
                const targetUuid = `Scene.${canvas.scene.id}.Token.${target.uuid}`
    
                if (targetUuid !== effect.parent.uuid && effect.sourceName !== 'Aid') return;
    
                await warpgate.revert(target, `aid`);
                Hooks.off(deleteHook, removeHealth)
            }
    
            Hooks.on(deleteHook, removeHealth);
    })
}