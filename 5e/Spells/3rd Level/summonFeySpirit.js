// Requires summon.js macro to be a macro in game called "Summon"

if (args[0].tag === 'OnUse') {
    const magicSignIntro = `jb2a.magic_signs.circle.02.conjuration.intro.green`
    const magicSignOutro = `jb2a.magic_signs.circle.02.conjuration.outro.green`

    const summonMacro = game.macros.getName('Summon')

    const midi = args[0]

    let summonOptions = {
        buttons: [
            { label: 'Fuming', value: 'Fuming Fey Spirit' },
            { label: 'Mirthful', value: 'Mirthful Fey Spirit' },
            { label: 'Tricksy', value: 'Tricksy Fey Spirit' },
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
    const hpBonus = 10 * (spellLevel - 3)
    const acBonus = spellLevel
    const damageBonus = spellLevel
    const attackBonus = caster.system.attributes.spelldc - 8

    const attack = summonActor.data.items.find(
        (item) => item.system.damage.parts.length > 0
    )

    let updates = {
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
                        attack.system.damage.parts[1],
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
        animation: {
            magicSignIntro,
            magicSignOutro,
        },
        midi,
        summon,
    }

    summonMacro.execute(scope)
}
