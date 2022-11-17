// Requires Advanced Macros, Dynamic Active Effects, JB2A, Midi-QOL, Sequencer, and Warpgate

if (args[0].midi.tag === 'OnUse') {
    const {
        animation,
        midi,
        summon: {
            duration = { seconds: 60, rounds: 10 },
            summonActorName,
            updates = {},
        },
    } = args[0]

    const actor = midi.actor
    const origin = midi.itemUuid

    const magicSignIntro =
        animation?.magicSignIntro ||
        `jb2a.magic_signs.circle.02.conjuration.intro.blue`
    const magicSignOutro =
        animation?.magicSignOutro ||
        `jb2a.magic_signs.circle.02.conjuration.outro.blue`

    const casterToken = await fromUuid(midi.tokenUuid)
    const caster = casterToken.actor

    const summonActor = game.actors.getName(summonActorName)

    if (!summonActor) {
        console.error(`No Actor with name: ${summonActorName}`)
        return
    }

    async function preEffects(template) {
        new Sequence('Datedsandwich Macros')
            .effect()
            .file(magicSignIntro)
            .atLocation(template)
            .belowTokens()
            .scale(0.25)
            .play()

        await warpgate.wait(2500)
    }

    async function postEffects(template) {
        new Sequence('Datedsandwich Macros')
            .effect()
            .file(magicSignOutro)
            .atLocation(template)
            .belowTokens()
            .scale(0.25)
            .thenDo(async () => {
                await Sequencer.EffectManager.endEffects({
                    name: 'magicSignLoop',
                })
            })
            .play()
    }

    const summonEffectCallbacks = {
        pre: animation?.preEffects || preEffects,
        post: animation?.postEffects || postEffects,
    }

    const summoned = await warpgate.spawn(
        summonActorName,
        updates,
        summonEffectCallbacks,
        { controllingActor: caster }
    )
    if (summoned.length !== 1) return

    const createdToken = game.canvas.tokens.get(summoned[0])
    const summonedUuid = createdToken.document.uuid

    const effects = await actor.createEmbeddedDocuments('ActiveEffect', [
        {
            label: 'Summon',
            icon: midi.item.img,
            origin,
            duration,
            'flags.dae.stackable': false,
            changes: [
                {
                    key: 'flags.dae.deleteUuid',
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: summonedUuid,
                    priority: 30,
                },
            ],
        },
    ])

    const effectUuids = effects.map((effect) => effect.uuid)

    const removeUuids = [
        ...getProperty(
            actor.data.flags,
            'midi-qol.concentration-data.removeUuids'
        ),
        ...effectUuids,
    ]

    if (removeUuids.length > 0)
        actor.setFlag('midi-qol', 'concentration-data.removeUuids', removeUuids)
}
