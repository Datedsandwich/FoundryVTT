// Requires Advanced Macros, DFred's Convenient Effects, Item Macro, Midi-QOL
// Remove the saving throw from the item, let the Macro handle it
if (args[0].tag === 'OnUse') {
    if (args[0].hitTargets.length === 0) return

    const casterToken = await fromUuid(args[0].tokenUuid)
    const caster = casterToken.actor

    const unholyTargetUuids = args[0].hitTargets
        .filter(
            (target) =>
                ['fiend', 'undead'].includes(
                    (
                        target.actor.system.details?.type?.value || ''
                    ).toLowerCase()
                ) && !target.actor.flags?.datedsandwich?.turnImmunity
        )
        .map((target) => target.uuid)

    const itemData = {
        name: 'Channel Divinity Wisdom Save',
        type: 'weapon',
        effects: [],
        data: {
            actionType: 'save',
            save: {
                dc: caster.system.attributes?.spelldc ?? 10,
                ability: 'wis',
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
        targetUuids: unholyTargetUuids,
    }
    const turnUnholySave = await MidiQOL.completeItemUse(item, {}, options)

    turnUnholySave.failedSaves.forEach((target) => {
        game.dfreds.effectInterface.addEffect({
            effectName: 'Channel Divinity: Turn the Unholy',
            uuid: target.actor.uuid,
        })
    })
}
