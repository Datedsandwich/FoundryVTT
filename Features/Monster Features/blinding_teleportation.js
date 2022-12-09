if (args[0].tag === 'OnUse') {
    const sourceToken = await fromUuid(args[0].tokenUuid)
    const template = await fromUuid(args[0].templateUuid)

    const centerPosition = canvas.grid.getCenter(
        template.data.x,
        template.data.y
    )

    await new Sequence()
        .effect()
        .file(
            'modules/jb2a_patreon/Library/Cantrip/Sacred_Flame/SacredFlameSource_01_Regular_Yellow_400x400.webm'
        )
        .atLocation(sourceToken)
        .scale(1)
        .randomRotation()
        .playbackRate(2)
        .wait(200)
        .effect()
        .file(
            'modules/jb2a_patreon/Library/Cantrip/Sacred_Flame/SacredFlameTarget_01_Regular_Yellow_400x400.webm'
        )
        .atLocation(template)
        .scale(2)
        .randomRotation()
        .playbackRate(2)
        .waitUntilFinished(-1500)
        .animation()
        .on(sourceToken)
        .teleportTo(template, { relativeToCenter: true })
        .snapToGrid()
        .offset({ x: canvas.grid.size * 2, y: canvas.grid.size * 2 })
        .animation()
        .on(sourceToken)
        .play()

    canvas.scene.deleteEmbeddedDocuments('MeasuredTemplate', [template.id])
}
