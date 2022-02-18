// Requires Advanced Macros, DFred's Convenient Effects, Item Macro, Midi-QOL
// Remove the saving throw from the item, let the Macro handle it
if (args[0].tag === "OnUse") {
    if (args[0].hitTargets.length === 0) return

    const casterToken = await fromUuid(args[0].tokenUuid)
    const caster = casterToken.actor

    function getDestroyUndeadCR(clericLevels) {
        switch (clericLevels) {
            case clericLevels >= 5 && clericLevels < 8:
                return 0.5
            case clericLevels >= 8 && clericLevels < 11:
                return 1
            case clericLevels >= 11 && clericLevels < 11:
                return 2
            case clericLevels >= 11 && clericLevels < 14:
                return 3
            case clericLevels >= 17:
                return 4
        }
    }

    const clericLevels = caster.classes?.cleric?.levels
    const destroyCR = getDestroyUndeadCR(clericLevels)

    const undeadTargetUuids = args[0].hitTargets.filter(target => (target.actor.data.data.details?.type?.value || '').toLowerCase().includes('undead')).map(target => target.uuid)

    const itemData = {
        name: 'Channel Divinity Wisdom Save',
        type: 'weapon',
        effects: [],
        data: {
            actionType: 'save',
            save: { dc: caster.data.data.attributes?.spelldc ?? 10, ability: 'wis', scaling: 'flat' },
            damage: { parts: [] },
            components: { concentration: false, material: false, ritual: false, somatic: false, value: '', vocal: false },
            duration: { units: 'inst', value: undefined },
            weaponType: 'improv'
        }
    }

    const item = new CONFIG.Item.documentClass(itemData, { parent: caster })

    const options = { showFullCard: false, createWorkflow: true, versatile: false, configureDialog: false, targetUuids: undeadTargetUuids };
    const turnUndeadSave = await MidiQOL.completeItemRoll(item, options);

    turnUndeadSave.failedSaves.forEach(target => {
        const cr = target.actor.data.data.details?.cr

        if (cr <= destroyCR) {
            game.dfreds.effectInterface.addEffect({ effectName: 'Dead', uuid: target.actor.uuid, overlay: true });
        } else {
            game.dfreds.effectInterface.addEffect({ effectName: 'Channel Divinity: Turn Undead', uuid: target.actor.uuid });
        }
    })
}