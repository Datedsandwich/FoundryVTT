// Requires Advanced Macros, Dynamic Active Effects, Item Macro, Midi-QOL, and Warpgate
// This macro assumes that you use the built-in templating for the spell, the macro itself doesn't place a template
if (args[0].tag === "OnUse") {
    const casterToken = await fromUuid(args[0].tokenUuid);
    const caster = casterToken.actor;

    const deleteHook = "deleteActiveEffect"
    
    const updates = {
        embedded: {
            Item: {
                'Call Lightning - Bolt': {
                    "description": {
                        "value": `<p><span style=\"color: #191813; font-size: 13px;\">A bolt of lightning flashes down from the cloud to that point. Each creature within 5 feet of that point must make a Dexterity saving throw. A creature takes ${args[0].spellLevel}d10 lightning damage on a failed save, or half as much damage on a successful one.</span></p>`
                    },
                    "type": "spell",
                    "img": "systems/dnd5e/icons/spells/lighting-sky-2.jpg",
                    "data": {
                        "ability": "",
                        "actionType": "save",
                        "activation": { "type": "action", "cost": 1, "condition": "" },
                        "damage": {
                            "parts": [[`${args[0].spellLevel}d10`, "lightning"]],
                            "versatile": ""
                        },
                        "save": { "ability": "dex", "dc": caster.data.data.attributes.spelldc ?? 10, "scaling": "spell" },
                        "level": 0,
                        "preparation": { "mode": 'cantrip', "prepared": true },
                        "range": { "value": null, "long": null, "units": "" },
                        "scaling": {
                            "mode": "none",
                            "formula": ""
                        },
                        "school": "con",
                        "target": {
                            "value": 5,
                            "width": null,
                            "units": "ft",
                            "type": "radius"
                        }
                    }
                }
            }
        }
    }

    await warpgate.mutate(casterToken, updates, {}, { name: `${caster.id}-call-lightning` });

    await caster.createEmbeddedDocuments("ActiveEffect", [{
        "changes": [],
        "label": "Call Lightning",
        "duration": { seconds: 600, rounds: 100 },
        "origin": args[0].itemUuid
    }]);

    async function handleConcentration(effect) {
        if (caster.uuid !== effect.parent.uuid) return;

        await warpgate.revert(casterToken, `${caster.id}-call-lightning`);

        Hooks.off(deleteHook, handleConcentration)
    }

    Hooks.on(deleteHook, handleConcentration); // This will only function if Midi-QOL is being used to manage concentration
}