// Requires Advanced Macros, Dynamic Active Effects, Item Macro, JB2A, Midi-QOL, Sequencer, and Warpgate
if (args[0].tag === "OnUse") {
    const magicSignIntro = `jb2a.magic_signs.circle.02.evocation.intro.blue`;
    const magicSignOutro = `jb2a.magic_signs.circle.02.evocation.outro.blue`;

    const casterToken = await fromUuid(args[0].tokenUuid);
    const caster = casterToken.actor;

    const summonActor = game.actors.getName("Spiritual Weapon")

    if (!summonActor) {
        console.error("No Spiritual Weapon Actor");
        return;
    }

    const attackBonus = caster.data.data.attributes.spelldc - 8
    const damageBonus = caster.data.data.abilities[caster.data.data.attributes.spellcasting].mod

    const attack = summonActor.data.items.find((item) => item.data.data.damage.parts.length > 0)

    const updates = {
        embedded: {
            Item: {
                "Spiritual Weapon Damage": {
                    "data.attackBonus": `${attackBonus - summonActor.data.data.abilities[`${attack.abilityMod}`].mod}`,
                    "data.damage.parts": [[`${Math.floor(args[0].spellLevel / 2)}d8 + ${damageBonus}`, "force"]]
                }
            }
        }
    };

    async function preEffects(template) {
        new Sequence("Datedsandwich Macros")
            .effect()
            .file(magicSignIntro)
            .atLocation(template)
            .belowTokens()
            .scale(0.25)
            .play()

        await warpgate.wait(2500);
    }

    async function postEffects(template, token) {
        new Sequence("Datedsandwich Macros")
            .effect()
            .file(magicSignOutro)
            .atLocation(template)
            .belowTokens()
            .scale(0.25)
            .play()
            
        await warpgate.wait(500);
    }

    const summonEffectCallbacks = {
        pre: preEffects,
        post: postEffects,
    };

    const summoned = await warpgate.spawn("Spiritual Weapon", updates, summonEffectCallbacks, { controllingActor: caster });
    if (summoned.length !== 1) return;

    const summonedUuid = `Scene.${canvas.scene.id}.Token.${summoned[0]}`;
    await caster.createEmbeddedDocuments("ActiveEffect", [{
        "changes": [{ "key": "flags.dae.deleteUuid", "mode": 5, "value": summonedUuid, "priority": "30" }],
        "label": "Spiritual Weapon",
        "duration": { seconds: 60, rounds: 10 },
        "origin": args[0].itemUuid
    }]);
}