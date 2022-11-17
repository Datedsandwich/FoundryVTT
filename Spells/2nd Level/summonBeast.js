// Requires summon.js macro to be a macro in game called "Summon"

if (args[0].tag === 'OnUse') {
    const summonMacro = game.macros.getName('Summon')

    const midi = args[0]

    let summonOptions = {
        buttons: [
            { label: 'Air', value: 'Air Bestial Spirit' },
            { label: 'Land', value: 'Land Bestial Spirit' },
            { label: 'Water', value: 'Water Bestial Spirit' },
        ],
    }

    const summonActorName = await warpgate.buttonDialog(summonOptions, 'row')
    const summonActor = game.actors.getName(summonActorName)

    if (!summonActor) {
        console.error(`No Actor with name: ${summonActorName}`)
        return
    }

    const casterToken = await fromUuid(midi.tokenUuid)
    const caster = casterToken.actor

    const spellLevel = midi.spellLevel
    const hpBonus = 5 * (spellLevel - 2)
    const acBonus = spellLevel
    const damageBonus = spellLevel
    const attackBonus = caster.system.attributes.spelldc - 8

    const attack = summonActor.data.items.find(
        (item) => item.system.damage.parts.length > 0
    )

    const updates = {
        actor: {
            'data.attributes.hp': {
                value: summonActor.system.attributes.hp.max + hpBonus,
                max: summonActor.system.attributes.hp.max + hpBonus,
            },
        },
        embedded: {
            ActiveEffect: {
                'Spell Level Bonus - AC': {
                    icon: 'icons/magic/defensive/shield-barrier-blue.webp',
                    label: 'Spell Level AC Bonus',
                    changes: [
                        {
                            key: 'data.attributes.ac.bonus',
                            mode: 2,
                            value: acBonus,
                            priority: 0,
                        },
                    ],
                },
            },
            Item: {
                [`${attack.data.name}`]: {
                    'data.attackBonus': `${
                        attackBonus -
                        summonActor.system.abilities[`${attack.system.ability}`]
                            .mod
                    }`,
                    'data.damage.parts': [
                        [
                            `${attack.system.damage.parts[0][0]} + ${damageBonus}`,
                            attack.system.damage.parts[0][1],
                        ],
                    ],
                },
            },
        },
    }

    const summon = {
        duration: { seconds: 3600, rounds: 600 },
        summonActorName,
        updates,
    }

    const scope = {
        midi,
        summon,
    }

    summonMacro.execute(scope)
}
