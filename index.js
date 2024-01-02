const { Client, Events, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const config = require('./config.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", async message => {
    if (message.content == "!start") {
        if (!config.owners.includes(message.author.id)) return;
        await message.delete();
        var row = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                    .setLabel("نوع التصميم")
                    .setCustomId("kind")
                    .setStyle(ButtonStyle.Success)
            );
        await message.channel.send({ content: "**اختر نوع التصميم**", components: [row] });
    }
});

client.on("interactionCreate", async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === "kind") {
            var rows = new ActionRowBuilder();

            config.kinds.forEach((m) => {
                console.log(m.name);
                rows.addComponents(
                    new ButtonBuilder()
                        .setCustomId(m.name)
                        .setLabel(m.name)
                        .setStyle(ButtonStyle.Secondary)
                );
            });

            console.log(rows);

            interaction.reply({ content: "اختر نوع التصميم", components: [rows], ephemeral: true });
        } else {
            try {
                var images = config.kinds.find((m) => m.name === interaction.customId);

                console.log("Custom ID:", interaction.customId);
                console.log("Images:", images);

                if (images) {
                   
                    await interaction.reply({ files:images.images,ephemeral:true });
                } else {
                    console.log("Images not found for custom ID:", interaction.customId);
                }
            } catch (error) {
                console.log("Error:", error);
                await interaction.reply({ content: error.message });
            }
        }
    }
});

client.login("MTE5MTcxODg0NzA2NjE1Mjk3MQ.G0RemT.xYxLV_5Dbck5FJiw_7aHPkT5ekk2Monk9TEFsA");
client.on("error" , errr => {
    console.log(errr);
})