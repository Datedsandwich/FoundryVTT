const version = '10.0.13'
try {
    if (args[0].tag === 'OnUse') {
        const casterToken = await fromUuid(args[0].tokenUuid)
        const caster = casterToken.actor
        let sphereActor = game.actors.getName('Flaming Sphere')

        if (!sphereActor) {
            console.error('No Flaming Sphere')
            return
        }

        const changeValue = `turn=end,saveDC=${
            caster.system.attributes.spelldc ?? 10
        },saveAbility=dex,damageRoll=${
            args[0].spellLevel
        }d6,damageType=fire,saveDamage=halfdamage,saveRemove=false`

        const updates = {
            Item: {
                'Flaming Sphere Damage': {
                    'data.damage.parts': [[`${args[0].spellLevel}d6`, 'fire']],
                    'data.save.dc': caster.system.attributes.spelldc,
                },
            },
            ActiveEffect: {
                'Flaming Sphere Damage': {
                    changes: [
                        {
                            key: 'flags.midi-qol.OverTime',
                            mode: 5,
                            value: changeValue,
                            priority: '20',
                        },
                    ],
                    disabled: false,
                    label: 'Flaming Sphere Damage',
                    icon: 'icons/magic/fire/orb-vortex.webp',
                    flags: {
                        ActiveAuras: {
                            isAura: true,
                            aura: 'All',
                            radius: 7.5,
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
            },
        }

        const summoned = await warpgate.spawn(
            'Flaming Sphere',
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
                label: 'Flaming Sphere Summon',
                duration: { seconds: 60, rounds: 10 },
                origin: args[0].itemUuid,
                'flags.dae.stackable': false,
                icon: 'icons/magic/fire/orb-vortex.webp',
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
    console.error(`${args[0].itemData.name} - Flaming Sphere ${version}`, err)
}
