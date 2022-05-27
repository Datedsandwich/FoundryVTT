// Requires summon.js macro to be a macro in game called "Summon"

if (args[0].tag === 'OnUse') {
    const magicSignIntro = `jb2a.magic_signs.circle.02.conjuration.intro.purple`
    const magicSignOutro = `jb2a.magic_signs.circle.02.conjuration.outro.purple`

    const summonMacro = game.macros.getName('Summon')

    const midi = args[0]

    let summonOptions = {
        buttons: [
            { label: 'Beholderkin', value: 'Beholderkin Aberrant Spirit' },
            { label: 'Slaadi', value: 'Slaadi Aberrant Spirit' },
            { label: 'Star Spawn', value: 'Star Spawn Aberrant Spirit' },
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
    const hpBonus = 10 * (spellLevel - 4)
    const acBonus = spellLevel
    const damageBonus = spellLevel
    const attackBonus = caster.data.data.attributes.spelldc - 8

    const attack = summonActor.data.items.find(
        (item) => item.data.data.damage.parts.length > 0
    )

    let updates = {
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

    if (summonActorName === 'Star Spawn Aberrant Spirit') {
        const changeValue = `turn=start,saveDC=${
            caster.data.data.attributes.spelldc ?? 10
        },saveAbility=wis,damageRoll=2d6,damageType=psychic,saveRemove=false`

        updates.embedded.ActiveEffect = {
            ...updates.embedded.ActiveEffect,
            'Whispering Aura': {
                changes: [
                    {
                        key: 'flags.midi-qol.OverTime',
                        mode: 5,
                        value: changeValue,
                        priority: '20',
                    },
                ],
                disabled: false,
                label: 'Whispering Aura',
                icon: 'icons/magic/control/fear-fright-white.webp',
                flags: {
                    ActiveAuras: {
                        isAura: true,
                        aura: 'All',
                        radius: 5,
                        alignment: '',
                        type: '',
                        ignoreSelf: true,
                        height: true,
                        hidden: false,
                        hostile: false,
                        onlyOnce: false,
                    },
                },
            },
        }
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
