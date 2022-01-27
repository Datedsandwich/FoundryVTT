if (args[0].tag === 'OnUse') {
    if (args[0].failedSaves.length === 0) return

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

    args[0].failedSaves.forEach(async target => {
        // If they failed the dex save, they also need to make a Strength saving throw
        const options = { showFullCard: false, createWorkflow: true, versatile: false, configureDialog: false };
        
        MidiQOL.completeItemRoll(item, options).then(async save => {
            console.log(save) // This is almost identical to args[0], but should be the new workflow?
            const restrained = await game.dfreds.effectInterface.hasEffectApplied('Restrained', target.actor.uuid)

            if (save.failedSaves.length === 0) {
                const updates = {
                    elevation: target.data.elevation + 10
                }
    
                await target.update(updates)
    
                if (!restrained) {
                    game.dfreds.effectInterface.toggleEffect('Restrained', { uuids: [target.actor.uuid] });
                }
            } else {
                console.log('Reducing Elevation')
    
                const updates = {
                    elevation: 0
                }
    
                await target.update(updates)
    
                if (restrained) {
                    game.dfreds.effectInterface.toggleEffect('Restrained', { uuids: [target.actor.uuid] });
                }
            }
        });
    })
}