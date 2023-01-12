// Requires Advanced Macros, DFred's Convenient Effects, Item Macro, Midi-QOL
// Remove the saving throw from the item, let the Macro handle it
if (args[0].tag === 'OnUse') {
    if (args[0].hitTargets.length === 0) return

    const casterToken = await fromUuid(args[0].tokenUuid)
    const caster = casterToken.actor

    const clericLevels = caster.classes?.cleric?.system?.levels
    const destroyCR =
        clericLevels >= 5 && clericLevels < 8
            ? 0.5
            : clericLevels >= 8 && clericLevels < 11
            ? 1
            : clericLevels >= 11 && clericLevels < 11
            ? 2
            : clericLevels >= 11 && clericLevels < 14
            ? 3
            : clericLevels >= 17
            ? 4
            : 0

    const undeadTargetUuids = args[0].hitTargets
        .filter(
            (target) =>
                (target.actor.system.details?.type?.value || '')
                    .toLowerCase()
                    .includes('undead') &&
                !target.actor.flags?.datedsandwich?.turnImmunity
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
        targetUuids: undeadTargetUuids,
    }
    const turnUndeadSave = await MidiQOL.completeItemUse(item, {}, options)

    turnUndeadSave.failedSaves.forEach((target) => {
        const cr = target.actor.system.details?.cr

        if (cr <= destroyCR) {
            game.dfreds.effectInterface.addEffect({
                effectName: 'Dead',
                uuid: target.actor.uuid,
                overlay: true,
            })
        } else {
            game.dfreds.effectInterface.addEffect({
                effectName: 'Channel Divinity: Turn Undead',
                uuid: target.actor.uuid,
            })
        }
    })
}
