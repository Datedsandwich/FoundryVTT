if (args[0].tag === "OnUse") {
    const summonMacro = game.macros.getName("Summon")

    const midi = args[0]

    const summonActorName = "Fire Elemental Spirit"
    const summonActor = game.actors.getName(summonActorName)

    if (!summonActor) {
        console.error(`No Actor with name: ${summonActorName}`)
        return
    }

    const casterToken = await fromUuid(midi.tokenUuid);
    const caster = casterToken.actor;

    const spellLevel = midi.itemLevel
    const hpBonus = 10 * (spellLevel - 4)
    const acBonus = spellLevel
    const damageBonus = spellLevel
    const attackBonus = caster.data.data.attributes.spelldc - 8

    const updates = {
        actor: {
            'data.attributes.hp': { value: summonActor.data.data.attributes.hp.max + hpBonus, max: summonActor.data.data.attributes.hp.max + hpBonus },
            'data.bonuses.msak': { attack: `- @mod - @prof + ${attackBonus}`, damage: `${damageBonus}` },
            'data.bonuses.mwak': { attack: `- @mod - @prof + ${attackBonus}`, damage: `${damageBonus}` },
            'data.bonuses.rsak': { attack: `- @mod - @prof + ${attackBonus}`, damage: `${damageBonus}` },
            'data.bonuses.rwak': { attack: `- @mod - @prof + ${attackBonus}`, damage: `${damageBonus}` }
        },
        embedded: {
            ActiveEffect: {
                "Spell Level Bonus - AC": {
                    icon: 'icons/magic/defensive/shield-barrier-blue.webp',
                    label: "Spell Level AC Bonus",
                    changes: [{
                        "key": "data.attributes.ac.bonus",
                        "mode": 2,
                        "value": acBonus,
                        "priority": 0
                    }]
                }
            }
        }
    }

    const summon = {
        summonActorName,
        updates
    }

    const scope = {
        midi,
        summon
    }

    summonMacro.execute(scope)
}

