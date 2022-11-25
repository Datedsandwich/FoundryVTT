const version = '10.0.13'
try {
    if (args[0].tag === 'OnUse') {
        const casterToken = await fromUuid(args[0].tokenUuid)
        const caster = casterToken.actor
        let spellActor = game.actors.getName('Maddening Darkness')

        if (!spellActor) {
            console.error('No Maddening Darkness Actor')
            return
        }

        const changeValue = `turn=end,saveDC=${
            caster.data.data.attributes.spelldc ?? 10
        },saveAbility=wis,damageRoll=${
            args[0].spellLevel
        }d8,damageType=psychic,saveDamage=halfdamage,saveRemove=false`

        const updates = {
            Item: {
                'Maddening Darkness Damage': {
                    'data.damage.parts': [[`${args[0].spellLevel}d6`, 'fire']],
                    'data.save.dc': caster.data.data.attributes.spelldc,
                },
            },
            ActiveEffect: {
                'Maddening Darkness Damage': {
                    changes: [
                        {
                            key: 'flags.midi-qol.OverTime',
                            mode: 5,
                            value: changeValue,
                            priority: '20',
                        },
                    ],
                    disabled: false,
                    label: 'Maddening Darkness Damage',
                    icon: 'icons/magic/unholy/silhouette-robe-evil-glow.webp',
                    flags: {
                        ActiveAuras: {
                            isAura: true,
                            aura: 'All',
                            radius: 60,
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
            'Maddening Darkness',
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
                label: 'Maddening Darkness Summon',
                duration: { seconds: 600, rounds: 100 },
                origin: args[0].itemUuid,
                'flags.dae.stackable': false,
                icon: 'icons/magic/unholy/silhouette-robe-evil-glow.webp',
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
        `${args[0].itemData.name} - Maddening Darkness ${version}`,
        err
    )
}
