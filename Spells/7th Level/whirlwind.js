if (args[0].tag === 'OnUse') {
    if (args[0].failedSaves.length === 0) return

    const casterToken = await fromUuid(args[0].tokenUuid)
    const caster = casterToken.actor

    const itemData = {
        name: 'Whirlwind Strength Save',
        type: 'weapon',
        effects: [],
        data: {
            actionType: 'save',
            save: {
                dc: args[0].item.data.save.dc ?? 10,
                ability: 'str',
                scaling: 'flat',
            },
            damage: { parts: [] },
            components: {
                concentration: false,
                material: false,
                ritual: false,
                somatic: false,
                value: '',
                vocal: false,
            },
            duration: { units: 'inst', value: undefined },
            weaponType: 'improv',
        },
    }

    const item = new CONFIG.Item.documentClass(itemData, { parent: caster })

    const options = {
        showFullCard: false,
        createWorkflow: true,
        versatile: false,
        configureDialog: false,
        targetUuids: args[0].failedSaveUuids,
    }
    const strengthSaves = await MidiQOL.completeItemRoll(item, options)

    strengthSaves.failedSaves.forEach(async (target) => {
        const restrained = await game.dfreds.effectInterface.hasEffectApplied(
            'Restrained',
            target.actor.uuid
        )
        !restrained &&
            game.dfreds.effectInterface.toggleEffect('Restrained', {
                uuids: [target.actor.uuid],
            })
    })
}
