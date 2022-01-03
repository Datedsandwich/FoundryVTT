// Requires Active Auras, Advanced Macros, Dynamic Active Effects, Item Macro, Midi-QOL, and Warpgate

if (args[0].tag === "OnUse") {
    const casterToken = await fromUuid(args[0].tokenUuid);
    const caster = casterToken.actor;

    const sphereActor = game.actors.getName("Flaming Sphere");
    if (!sphereActor) {
        console.error("No Flaming Sphere");
        return;
    }

    const changeValue = `turn=end,saveDC=${caster.data.data.attributes.spelldc ?? 10},saveAbility=dex,damageRoll=${args[0].spellLevel}d6,damageType=fire,saveDamage=halfdamage,saveRemove=false`;
    const updates = {
        Item: {
            "Flaming Sphere Damage": {
                "data.damage.parts": [[`${args[0].spellLevel}d6`, "fire"]],
                "data.save.dc": caster.data.data.attributes.spelldc
            }
        },
        ActiveEffect: {
            "Flaming Sphere Damage": {
                "changes": [{ "key": "flags.midi-qol.OverTime", "mode": 5, "value": changeValue, "priority": "20" }],
                "disabled": false,
                "label": "Flaming Sphere Damage",
                "icon": "icons/magic/fire/orb-vortex.webp",
                "flags": {
                    "ActiveAuras": {
                        "isAura": true,
                        "aura": "All",
                        "radius": 5,
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
    const summoned = await warpgate.spawn("Flaming Sphere", { embedded: updates }, {}, { controllingActor: caster });
    if (summoned.length !== 1) return;
    const summonedUuid = `Scene.${canvas.scene.id}.Token.${summoned[0]}`;
    await caster.createEmbeddedDocuments("ActiveEffect", [{
        "changes": [{ "key": "flags.dae.deleteUuid", "mode": 5, "value": summonedUuid, "priority": "30" }],
        "label": "Flaming Sphere Summon",
        "duration": { seconds: 60, rounds: 10 },
        "origin": args[0].itemUuid
    }]);
}