if (args[0].tag === "OnUse") {
    const casterToken = await fromUuid(args[0].tokenUuid)
    const caster = casterToken.actor

    await caster.sheet.minimize()

    let summonOptions = {
        buttons: [
            { label: "Boneclaws", value: "Boneclaw" },
            { label: "Dragon Zombies", value: "Dragon Zombie" },
            { label: "Skeletal Juggernauts", value: "Skeletal Juggernaut" },
            { label: "Wraiths", value: "Wraith" }
        ]
    };

    const summons = {
        'Boneclaw': {
            number: 2,
            scale: 0.75
        },
        'Dragon Zombie': {
            number: 2,
            scale: 1
        },
        'Skeletal Juggernaut': {
            number: 6,
            scale: 0.75
        },
        'Wraith': {
            number: 4,
            scale: 0.5
        }
    }

    const summonActorName = await warpgate.buttonDialog(summonOptions, 'column');
    const summonActor = game.actors.getName(summonActorName)

    if (!summonActor) {
        console.error(`No Actor with name: ${summonActorName}`)
        return
    }

    async function preEffects(template) {
        const scale = summons[summonActorName].scale

        new Sequence("Datedsandwich Macros")
            .effect()
            .file('jb2a.toll_the_dead.green.skull_smoke')
            .atLocation(template)
            .scale(scale)
            .play()
    }

    async function postEffects(template, token) {
        new Sequence("Datedsandwich Macros").animation()
            .on(token)
            .fadeIn(500)
            .play()
    }

    const summonEffectCallbacks = {
        pre: preEffects,
        post: postEffects,
    }

    for (let i = 0; i < summons[summonActorName].number; i++) {
        await warpgate.spawn(summonActorName, {}, summonEffectCallbacks, {})
    }

    await caster.sheet.maximize()
}