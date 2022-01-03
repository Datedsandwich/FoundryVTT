// Requires Active Auras, Advanced Macros, Dynamic Active Effects, Item Macro, JB2A, Midi-QOL, Sequencer, and Warpgate
if (args[0].tag === "OnUse") {
    const moonbeamIntro = `jb2a.moonbeam.01.intro.blue`;
    const moonbeamOutro = `jb2a.moonbeam.01.outro.blue`;

    const deleteHook = "deleteActiveEffect"

    const casterToken = await fromUuid(args[0].tokenUuid);
    const caster = casterToken.actor;

    if (!game.actors.getName("Moonbeam")) {
        console.error("No Moonbeam Actor");
        return;
    }

    const changeValue = `turn=start,saveDC=${caster.data.data.attributes.spelldc ?? 10},saveAbility=con,damageRoll=${args[0].spellLevel}d10,damageType=radiant,saveDamage=halfdamage,saveRemove=false`;
    const updates = {
        Item: {
            "Moonbeam Damage": {
                "data.damage.parts": [[`${args[0].spellLevel}d10`, "radiant"]],
                "data.save.dc": caster.data.data.attributes.spelldc
            }
        },
        ActiveEffect: {
            "Moonbeam Damage": {
                "changes": [{ "key": "flags.midi-qol.OverTime", "mode": 5, "value": changeValue, "priority": "20" }],
                "disabled": false,
                "label": "Moonbeam Damage",
                "icon": "systems/dnd5e/icons/spells/beam-blue-3.jpg",
                "flags": {
                    "ActiveAuras": {
                        "isAura": true,
                        "aura": "All",
                        "radius": 1,
                        "alignment": "",
                        "type": "",
                        "ignoreSelf": true,
                        "height": true,
                        "hidden": false,
                        "hostile": false,
                        "onlyOnce": false
                    }
                },
            }
        }
    };

    async function preEffects(template) {
        new Sequence("Datedsandwich Macros")
            .effect()
            .file(moonbeamIntro)
            .atLocation(template)
            .belowTokens()
            .scale(0.25)
            .zIndex(1)
            .center()
            .fadeIn(500)
            .play()
    }

    let summonEffectCallbacks = {
        pre: async (template, update) => {
            preEffects(template);
            await warpgate.wait(1750);
        }
    };

    const summoned = await warpgate.spawn("Moonbeam", { embedded: updates }, summonEffectCallbacks, { controllingActor: caster });
    if (summoned.length !== 1) return;

    const summonedUuid = `Scene.${canvas.scene.id}.Token.${summoned[0]}`;
    await caster.setFlag("midi-qol", "moonbeam", summonedUuid);
    await caster.createEmbeddedDocuments("ActiveEffect", [{
        "changes": [{ "key": "flags.dae.deleteUuid", "mode": 5, "value": summonedUuid, "priority": "30" }],
        "label": "Moonbeam",
        "duration": { seconds: 60, rounds: 10 },
        "origin": args[0].itemUuid
    }]);

    async function handleConcentration(effect) {
        if (caster.uuid !== effect.parent.uuid) return;

        const tokenUuid = await caster.getFlag("midi-qol", "moonbeam")

        if (!tokenUuid) return;

        const token = await fromUuid(tokenUuid)

        new Sequence("Moonbeam")
            .effect()
            .file(moonbeamOutro)
            .atLocation(token.object.transform)
            .playbackRate(2)
            .offset({ x: -canvas.grid.size / 2, y: -canvas.grid.size / 2 }) // Token transform is top left of square
            .belowTokens()
            .scale(0.25)
            .play()


        await caster.unsetFlag("midi-qol", "moonbeam");
        Hooks.off(deleteHook, handleConcentration)
    }

    Hooks.on(deleteHook, handleConcentration); // This will only function if Midi-QOL is being used to manage concentration
}