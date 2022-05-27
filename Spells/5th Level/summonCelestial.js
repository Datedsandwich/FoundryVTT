// Requires summon.js macro to be a macro in game called "Summon"

if (args[0].tag === 'OnUse') {
    const magicSignIntro = `jb2a.magic_signs.circle.02.conjuration.intro.yellow`
    const magicSignOutro = `jb2a.magic_signs.circle.02.conjuration.outro.yellow`

    const summonMacro = game.macros.getName('Summon')

    const midi = args[0]

    let summonOptions = {
        buttons: [
            { label: 'Avenger', value: 'Avenger Celestial Spirit' },
            { label: 'Defender', value: 'Defender Celestial Spirit' },
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
    const hpBonus = 10 * (spellLevel - 5)
    const acBonus = spellLevel // The Defender actor has a higher base AC
    const damageBonus = spellLevel
    const attackBonus = caster.data.data.attributes.spelldc - 8

    const attack = summonActor.data.items.find(
        (item) => item.data.data.damage.parts.length > 0
    )

    const updates = {
        actor: {
            'data.attributes.hp': {
                value: summonActor.data.data.attributes.hp.max + hpBonus,
                max: summonActor.data.data.attributes.hp.max + hpBonus,
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
                        summonActor.data.data.abilities[`${attack.abilityMod}`]
                            .mod
                    }`,
                    'data.damage.parts': [
                        [
                            `${attack.data.data.damage.parts[0][0]} + ${damageBonus}`,
                            attack.data.data.damage.parts[0][1],
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
        animation: {
            magicSignIntro,
            magicSignOutro,
        },
        midi,
        summon,
    }

    summonMacro.execute(scope)
}
