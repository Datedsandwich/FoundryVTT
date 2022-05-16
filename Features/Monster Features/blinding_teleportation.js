if (args[0].tag === "OnUse") {
    const sourceToken = await fromUuid(args[0].tokenUuid);
    const template = await fromUuid(args[0].templateUuid)

    const centerPosition = canvas.grid.getCenter(template.data.x, template.data.y);

    canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", [template.id])

    const offset = sourceToken.data.width/2 * canvas.grid.size

    new Sequence().effect()
        .file('modules/jb2a_patreon/Library/Cantrip/Sacred_Flame/SacredFlameSource_01_Regular_Yellow_400x400.webm')
        .atLocation(sourceToken)
        .scale(1)
        .randomRotation()
        .playbackRate(2)
        .waitUntilFinished(-500)
        .animation()
        .on(sourceToken)
        .opacity(0)
        .fadeOut(500)
        .teleportTo({ x: centerPosition[0] - offset, y: centerPosition[1] - offset })
        .snapToGrid(false)
        .effect()
        .file('modules/jb2a_patreon/Library/Cantrip/Sacred_Flame/SacredFlameTarget_01_Regular_Yellow_400x400.webm')
        .atLocation({ x: centerPosition[0], y: centerPosition[1] })
        .snapToGrid(false)
        .scale(2)
        .randomRotation()
        .playbackRate(2)
        .waitUntilFinished(-500)
        .animation()
        .on(sourceToken)
        .opacity(1)
        .fadeIn(500)
        .play()
}