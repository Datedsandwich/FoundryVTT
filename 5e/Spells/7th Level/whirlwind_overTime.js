if (args[0].tag === 'OnUse') {
    args[0].hitTargets.forEach(async (target) => {
        const restrained = await game.dfreds.effectInterface.hasEffectApplied(
            'Restrained',
            target.actor.uuid
        )

        if (restrained && target.data.elevation < 30) {
            const updates = {
                token: {
                    elevation: target.data.elevation + 5,
                },
            }

            await warpgate.mutate(
                target,
                updates,
                {},
                { permanent: true, name: 'whirlwind' }
            )
        }
    })
}
