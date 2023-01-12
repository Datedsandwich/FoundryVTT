// Quick and dirty for Saturday's game
if (args[0].tag === "OnUse") {
    const midi = args[0]

    const casterToken = await fromUuid(args[0].tokenUuid);
    const caster = casterToken.actor;

    const summonActorName = "Terfel's Echo"
    const summonActor = game.actors.getName(summonActorName)

    if (!summonActor) {
        console.error("No Echo :(");
        return;
    }

    caster.effects.find(effect => effect.data.label === 'Manifested Echo')?.delete()

    async function preEffects(template) {
        new Sequence("Datedsandwich Macros")
            .effect()
            .file('jb2a.explosion.01.purple')
            .atLocation(template)
            .scale(0.5)
            .play()

        await warpgate.wait(400)
    }

    const summonEffectCallbacks = {
        pre: preEffects
    }

    const summoned = await warpgate.spawn(summonActorName, {}, summonEffectCallbacks, { controllingActor: caster })
    if (summoned.length !== 1) return

    const summonedUuid = `Scene.${canvas.scene.id}.Token.${summoned[0]}`

    await caster.createEmbeddedDocuments("ActiveEffect", [{
        "changes": [{ "key": "flags.dae.deleteUuid", "mode": 5, "value": summonedUuid, "priority": "30" }],
        "label": "Manifested Echo",
        "duration": {seconds: 600, rounds: 100},
        "origin": midi.itemUuid,
        "flags.dae.stackable": false
    }])
}