// Requires Advanced Macros, Dynamic Active Effects, JB2A, Midi-QOL, Sequencer, and Warpgate

if (args[0].midi.tag === "OnUse") {
    const magicSignIntro = `jb2a.magic_signs.circle.02.conjuration.intro.blue`;
    const magicSignLoop = `jb2a.magic_signs.circle.02.conjuration.loop.blue`;
    const magicSignOutro = `jb2a.magic_signs.circle.02.conjuration.outro.blue`;
    const eldritchBlast = `jb2a.eldritch_blast.lightblue.05ft`;

    const { midi, summon: { summonActorName, updates = {} } } = args[0]

    const casterToken = await fromUuid(midi.tokenUuid);
    const caster = casterToken.actor;

    const summonActor = game.actors.getName(summonActorName)

    if (!summonActor) {
        console.error(`No Actor with name: ${summonActorName}`);
        return;
    }

    async function preEffects(template) {
        new Sequence("Datedsandwich Macros")
            .effect()
            .file(magicSignIntro)
            .atLocation(template)
            .belowTokens()
            .scale(0.25)
            .waitUntilFinished(-1000)
            .effect()
            .file(magicSignLoop)
            .atLocation(template)
            .belowTokens()
            .scale(0.25)
            .persist()
            .fadeOut(750, { ease: "easeInQuint" })
            .name("magicSignLoop")
            .effect()
            .file(eldritchBlast)
            .atLocation(template)
            .waitUntilFinished(-1000)
            .endTime(3300)
            .scaleOut(0, 500)
            .scale(1.5)
            .zIndex(1)
            .center()
            .play()
    }

    async function postEffects(template, token) {
        new Sequence("Datedsandwich Macros")
            .effect()
            .file(magicSignOutro)
            .atLocation(template)
            .belowTokens()
            .scale(0.25)
            .thenDo(async () => {
                await Sequencer.EffectManager.endEffects({ name: "magicSignLoop" });
            })
            .wait(1500)
            .animation()
            .on(token)
            .fadeIn(100, { ease: "easeInQuint" })
            .play()
    }

    let summonEffectCallbacks = {
        pre: async (template, update) => {
            preEffects(template);
            await warpgate.wait(3300);
        },
        post: async (template, token) => {
            postEffects(template, token);
        },
    };

    const summoned = await warpgate.spawn(summonActorName, updates, summonEffectCallbacks, { controllingActor: caster });
    if (summoned.length !== 1) return;

    const summonedUuid = `Scene.${canvas.scene.id}.Token.${summoned[0]}`;

    await caster.createEmbeddedDocuments("ActiveEffect", [{
        "changes": [{ "key": "flags.dae.deleteUuid", "mode": 5, "value": summonedUuid, "priority": "30" }],
        "label": "Summon",
        "duration": { seconds: 60, rounds: 10 },
        "origin": midi.itemUuid
    }]);
}