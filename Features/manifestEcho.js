// Quick and dirty for Saturday's game
if (args[0].tag === "OnUse") {
    const summonMacro = game.macros.getName("Summon")

    const midi = args[0]

    const casterToken = await fromUuid(args[0].tokenUuid);
    const caster = casterToken.actor;

    const summonActorName = "Terfel's Echo"
    const summonActor = game.actors.getName(summonActorName)

    if (!summonActor) {
        console.error("No Echo :(");
        return;
    }

    const summon = {
        duration: {seconds: 600, rounds: 100},
        summonActorName,
        updates: {}
    }

    const scope = {
        midi,
        summon
    }

    summonMacro.execute(scope)
}