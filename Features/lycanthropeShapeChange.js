if (args[0].tag === "OnUse") {
    const token = await fromUuid(args[0].tokenUuid);

    const currentImage = token.data.img
    let newImage

    if(currentImage.includes('Hybrid')) {
        newImage = `${currentImage.split('_Hybrid.png')[0]}.png`
    } else {
        newImage = `${currentImage.split('.png')[0]}_Hybrid.png`
    }

    const updates = {_id: token.id, img: newImage};
    await token.update(updates);
}