const version = '10.0.13'
try {
    console.log(args[0])
    if (args[0].tag === 'OnUse') {
        if (args[0].failedSaves.length === 0) return

        async function hasExhaustion(level, target) {
            const exhaustion =
                await game.dfreds.effectInterface.hasEffectApplied(
                    `Exhaustion ${level}`,
                    target.actor.uuid
                )

            return exhaustion
        }

        async function getCurrentExhaustionLevel(target) {
            const exhaustionLevels = []

            for (let i = 1; i < 6; i++) {
                const exhaustionLevel = await hasExhaustion(i, target)

                if (exhaustionLevel) exhaustionLevels.push(i)
            }

            if (exhaustionLevels.length === 0) return 0

            console.log(exhaustionLevels)

            return exhaustionLevels[exhaustionLevels.length - 1]
        }

        args[0].failedSaves.forEach(async (target) => {
            const currentExhaustionLevel = await getCurrentExhaustionLevel(
                target
            )

            console.log(`Current Exhaustion Level: ${currentExhaustionLevel}`)

            if (currentExhaustionLevel === 5) {
                await game.dfreds.effectInterface.addEffect({
                    effectName: `Dead`,
                    uuid: target.actor.uuid,
                })

                return
            }

            if (currentExhaustionLevel === 0) {
                await game.dfreds.effectInterface.addEffect({
                    effectName: `Exhaustion 1`,
                    uuid: target.actor.uuid,
                })
            } else {
                await game.dfreds.effectInterface.addEffect({
                    effectName: `Exhaustion ${currentExhaustionLevel + 1}`,
                    uuid: target.actor.uuid,
                })
            }
        })
    }
} catch (err) {
    console.error(
        `${args[0].itemData.name} - Sickening Radiance ${version}`,
        err
    )
}
