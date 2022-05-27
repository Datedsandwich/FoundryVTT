if (args[0].tag === 'OnUse') {
    if (args[0].failedSaves.length === 0) return // Nobody failed the save, no need to run anything else

    const casterToken = await fromUuid(args[0].tokenUuid)
    const caster = casterToken.actor

    async function applyDivineWord(target) {
        if (
            ['celestial', 'elemental', 'fey', 'fiend'].some((type) =>
                (target.actor.data.data.details?.type?.value || '')
                    .toLowerCase()
                    .includes(type)
            )
        ) {
            target.object.toggleVisibility()
        }

        const targetHp = target.actor.data.data.attributes.hp.value

        if (targetHp <= 20) {
            await target.actor.update({ 'data.attributes.hp.value': 0 })
        } else if (targetHp <= 30) {
            await game.cub.addCondition(
                ['Blinded', 'Deafened', 'Stunned'],
                target
            )
            game.Gametime.doIn({ hours: 1 }, async () => {
                game.cub.removeCondition(
                    ['Blinded', 'Deafened', 'Stunned'],
                    target
                ) // Not sure if this is better than the effect approach in my other macros, but it's nice not to need to use a hook
            })
        } else if (targetHp <= 40) {
            await game.cub.addCondition(['Blinded', 'Deafened'], target)
            game.Gametime.doIn({ minutes: 10 }, async () => {
                game.cub.removeCondition(['Blinded', 'Deafened', target])
            })
        } else if (targetHp <= 50) {
            await game.cub.addCondition('Deafened', target)
            game.Gametime.doIn({ minutes: 1 }, async () => {
                game.cub.removeCondition('Deafened', target)
            })
        }
    }

    args[0].failedSaves.forEach(applyDivineWord)
}
