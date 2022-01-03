// Requires Advanced Macros, Dynamic Active Effects, JB2A, Midi-QOL, Sequencer, and Warpgate

if (args[0].midi.tag === "OnUse") {
    const { animation, midi, summon: { summonActorName, updates = {} } } = args[0]

    const magicSignIntro = animation?.magicSignIntro || `jb2a.magic_signs.circle.02.conjuration.intro.blue`
    const magicSignOutro = animation?.magicSignOutro || `jb2a.magic_signs.circle.02.conjuration.outro.blue`

    const casterToken = await fromUuid(midi.tokenUuid)
    const caster = casterToken.actor

    const summonActor = game.actors.getName(summonActorName)

    if (!summonActor) {
        console.error(`No Actor with name: ${summonActorName}`)
        return
    }

    async function preEffects(template) {
        new Sequence("Datedsandwich Macros")
            .effect()
            .file(magicSignIntro)
            .atLocation(template)
            .belowTokens()
            .scale(0.25)
            .play()

        await warpgate.wait(2500)
    }

    async function postEffects(template) {
        new Sequence("Datedsandwich Macros")
            .effect()
            .file(magicSignOutro)
            .atLocation(template)
            .belowTokens()
            .scale(0.25)
            .thenDo(async () => {
                await Sequencer.EffectManager.endEffects({ name: "magicSignLoop" })
            })
            .play()
    }

    const summonEffectCallbacks = {
        pre: preEffects,
        post: postEffects,
    }

    const summoned = await warpgate.spawn(summonActorName, updates, summonEffectCallbacks, { controllingActor: caster })
    if (summoned.length !== 1) return

    const summonedUuid = `Scene.${canvas.scene.id}.Token.${summoned[0]}`

    await caster.createEmbeddedDocuments("ActiveEffect", [{
        "changes": [{ "key": "flags.dae.deleteUuid", "mode": 5, "value": summonedUuid, "priority": "30" }],
        "label": "Summon",
        "duration": { seconds: 60, rounds: 10 },
        "origin": midi.itemUuid
    }])
}