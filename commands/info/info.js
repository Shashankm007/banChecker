const {
    Client,
    MessageEmbed
} = require("discord.js");

const client = new Client({
    disableEveryone: true
});

module.exports = {
    name: "info",
    category: "info",
    description: "Sends info about the bot",
    run: async(client, message, args) => {
        const infoEmbed = new MessageEmbed()
            .setColor('#94a5f7')
            .setTitle(`${client.user.tag}`)
            .setURL("")
            .setDescription("$help")
            .setThumbnail(`${client.user.displayAvatarURL({ format: "png", dynamic: true })}`)
            .addField("Twitter", "@znixhook", true)
            .addField("Twitter", "@noobmaster007", true)
            .setTimestamp()
            .setFooter("");
        //console.log(`${client.user.displayAvatarURL({ format: "png", dynamic: true })}`);
        message.channel.send(infoEmbed);
    }
}