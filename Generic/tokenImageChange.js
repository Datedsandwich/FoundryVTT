const originalImage = args[1]
const newImage = args[2]
const lastArg = args[args.length - 1]

if (args[0] === 'on') {
    const token = await fromUuid(args[args.length - 1].tokenUuid);
    const updates = { _id: token.id, img: newImage };
    await token.update(updates);
} else if(args[0] === 'off') {
    const token = await fromUuid(args[args.length - 1].tokenUuid);
    const updates = { _id: token.id, img: originalImage };
    await token.update(updates);
}