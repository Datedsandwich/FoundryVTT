const version = '10.0.13'
try {
    if (args[0].tag === 'OnUse') {
        const casterToken = await fromUuid(args[0].tokenUuid)
        const caster = casterToken.actor
        let spellActor = game.actors.getName('Sickening Radiance')

        if (!spellActor) {
            console.error('No Sickening Radiance Actor')
            return
        }

        const changeValue = `turn=start,saveDC=${
            caster.system.attributes.spelldc ?? 10
        },saveAbility=con,damageRoll=${
            args[0].spellLevel
        }d10,damageType=radiant,saveDamage=halfdamage,saveRemove=false,macro="Sickening Radiance Overtime"`

        const updates = {
            Item: {
                'Sickening Radiance Damage': {
                    'data.damage.parts': [
                        [`${args[0].spellLevel}d10`, 'radiant'],
                    ],
                    'data.save.dc': caster.system.attributes.spelldc,
                },
            },
            ActiveEffect: {
                'Sickening Radiance Damage': {
                    changes: [
                        {
                            key: 'flags.midi-qol.OverTime',
                            mode: 5,
                            value: changeValue,
                            priority: '20',
                        },
                    ],
                    disabled: false,
                    label: 'Sickening Radiance Damage',
                    icon: 'icons/magic/air/air-burst-spiral-large-teal-green.webp',
                    origin: args[0].itemUuid,
                    flags: {
                        ActiveAuras: {
                            isAura: true,
                            aura: 'All',
                            radius: 25,
                            alignment: '',
                            type: '',
                            ignoreSelf: true,
                            height: true,
                            hidden: false,
                            hostile: false,
                            onlyOnce: false,
                            displayTemp: true,
                        },
                    },
                },
            },
        }

        const summoned = await warpgate.spawn(
            'Sickening Radiance',
            { embedded: updates },
            {},
            {}
        )

        if (summoned.length !== 1) return

        const summonedUuid = canvas.scene.tokens.get(summoned[0]).uuid

        const effects = await caster.createEmbeddedDocuments('ActiveEffect', [
            {
                changes: [
                    {
                        key: 'flags.dae.deleteUuid',
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: summonedUuid,
                        priority: 30,
                    },
                ],
                label: 'Sickening Radiance Summon',
                duration: { seconds: 600, rounds: 100 },
                origin: args[0].itemUuid,
                'flags.dae.stackable': false,
                icon: 'icons/magic/air/air-burst-spiral-large-teal-green.webp',
            },
        ])

        const effectUuids = effects.map((effect) => effect.uuid)

        const removeUuids = [
            ...getProperty(
                actor.data.flags,
                'midi-qol.concentration-data.removeUuids'
            ),
            ...effectUuids,
        ]

        if (removeUuids.length > 0)
            actor.setFlag(
                'midi-qol',
                'concentration-data.removeUuids',
                removeUuids
            )
    }
} catch (err) {
    console.error(
        `${args[0].itemData.name} - Sickening Radiance ${version}`,
        err
    )
}
