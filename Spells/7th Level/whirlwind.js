if (args[0].tag === 'OnUse') {
    if (args[0].failedSaves.length === 0) return;

    const casterToken = await fromUuid(args[0].tokenUuid)
    const caster = casterToken.actor

    const itemData = {
        name: 'Whirlwind',
        type: 'weapon',
        effects: [],
        data: {
            actionType: 'save',
            save: { dc: args[0].item.data.save.dc ?? 10, ability: 'str', scaling: 'flat' },
            damage: { parts: [] },
            components: { concentration: false, material: false, ritual: false, somatic: false, value: '', vocal: false },
            duration: { units: 'inst', value: undefined },
            weaponType: 'improv'
        }
    }

    const item = new CONFIG.Item.documentClass(itemData, { parent: caster })

    const options = { showFullCard: false, createWorkflow: true, versatile: false, configureDialog: false, targetUuids: args[0].failedSaveUuids };
    const strengthSaves = await MidiQOL.completeItemRoll(item, options);
    console.log("return is ", strengthSaves)

    strengthSaves.failedSaves.forEach(async target => {
        const updates = {
            elevation: target.data.elevation + 10
        }

        await target.data.update(updates)

        const restrained = await game.dfreds.effectInterface.hasEffectApplied('Restrained', target.actor.uuid)
        if (!restrained) {
            game.dfreds.effectInterface.toggleEffect('Restrained', { uuids: [target.actor.uuid] });
        }
    })

    const failedSaveUuids = [...strengthSaves.failedSaves].map(target => target.document.uuid)
    const successfulSaves = [...strengthSaves.saves].filter(target => !failedSaveUuids.includes(target.document.uuid))

    successfulSaves.forEach(async target => {
        const updates = {
            elevation: 0
        }

        await target.update(updates)

        if (restrained) {
            game.dfreds.effectInterface.toggleEffect('Restrained', { uuids: [target.actor.uuid] });
        }
    })
}