if (args[0].tag === 'OnUse') {
    const sourceToken = await fromUuid(args[0].tokenUuid)
    const template = await fromUuid(args[0].templateUuid)

    const centerPosition = canvas.grid.getCenter(
        template.data.x,
        template.data.y
    )

    canvas.scene.deleteEmbeddedDocuments('MeasuredTemplate', [template.id])

    new Sequence()
        .effect()
        .file('jb2a.energy_strands.in.red.01.0')
        .atLocation(sourceToken)
        .scale(1)
        .randomRotation()
        .playbackRate(1)
        .wait(1000)
        .effect()
        .file('jb2a.toll_the_dead.grey.skull_smoke')
        .atLocation({ x: centerPosition[0], y: centerPosition[1] })
        .scale(2)
        .randomRotation()
        .playbackRate(1)
        .waitUntilFinished(-2000)
        .animation()
        .on(sourceToken)
        .opacity(0)
        .fadeOut(500)
        .teleportTo(
            { x: centerPosition[0], y: centerPosition[1] },
            { relativeToCenter: true }
        )
        .animation()
        .on(sourceToken)
        .opacity(1)
        .fadeIn(500)
        .play()
}
