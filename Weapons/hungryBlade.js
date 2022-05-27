if (args[0].tag === 'OnUse') {
    if (args[0].hitTargets.length === 0) return
    const sourceToken = await fromUuid(args[0].tokenUuid)
    const source = sourceToken.actor
    const target = canvas.tokens.get(args[0].hitTargets[0].id)
}
