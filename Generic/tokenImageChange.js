const originalImage = args[1]
const newImage = args[2]
const lastArg = args[args.length - 1]

if (args[0] === 'on') {
    const token = await fromUuid(args[args.length - 1].tokenUuid);
    const updates = { token: { _id: token.id, img: newImage } };

    await warpgate.mutate(token, updates, {}, { name: 'Shapechanged' })
} else if (args[0] === 'off') {
    const token = await fromUuid(args[args.length - 1].tokenUuid);

    await warpgate.revert(token, 'Shapechanged')
}