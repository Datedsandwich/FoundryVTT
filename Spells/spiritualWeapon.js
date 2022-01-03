// Requires Advanced Macros, Dynamic Active Effects, Item Macro, JB2A, Midi-QOL, Sequencer, and Warpgate
if (args[0].tag === "OnUse") {
    const summonMacro = game.macros.getName("Summon")

    const midi = args[0]

    const magicSignIntro = `jb2a.magic_signs.circle.02.evocation.intro.blue`;
    const magicSignOutro = `jb2a.magic_signs.circle.02.evocation.outro.blue`;

    const casterToken = await fromUuid(args[0].tokenUuid);
    const caster = casterToken.actor;

    const summonActorName = "Spiritual Weapon"
    const summonActor = game.actors.getName(summonActorName)

    if (!summonActor) {
        console.error("No Spiritual Weapon Actor");
        return;
    }

    const attackBonus = caster.data.data.attributes.spelldc - 8
    const damageBonus = caster.data.data.abilities[caster.data.data.attributes.spellcasting].mod

    const attack = summonActor.data.items.find((item) => item.data.data.damage.parts.length > 0)

    const updates = {
        embedded: {
            Item: {
                "Spiritual Weapon Damage": {
                    "data.attackBonus": `${attackBonus - summonActor.data.data.abilities[`${attack.abilityMod}`].mod}`,
                    "data.damage.parts": [[`${Math.floor(args[0].spellLevel / 2)}d8 + ${damageBonus}`, "force"]]
                }
            }
        }
    };

    const summon = {
        duration: {seconds: 60, rounds: 10},
        summonActorName,
        updates
    }

    const scope = {
        animation: {
            magicSignIntro,
            magicSignOutro
        },
        midi,
        summon
    }

    summonMacro.execute(scope)
}