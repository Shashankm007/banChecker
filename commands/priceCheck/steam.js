var Steam = require('steam');

const {
    Client,
    MessageEmbed
} = require("discord.js");

const client = new Client({
    disableEveryone: true
});

module.exports = {
    name: "steam",
    category: "priceCheck",
    description: "Checks the price of an item on steam community market.",
    run: async(client, message, args) => {
        console.log(args);
    }
}