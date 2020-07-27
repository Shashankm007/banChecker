const Bitskins = require('bitskins');
var totp = require('notp').totp;
var base32 = require('thirty-two');

const bitskinSecret = "PCYOP6YCUKQYP446";
const bitskinsAPI = "9330824e-cca0-4eaf-847d-7c698b3a1126";
var code = totp.gen(base32.decode(bitskinSecret))

const api = new Bitskins.API(bitskinsAPI,bitskinSecret);
const sockets = new Bitskins.WebSocket();

const {
    Client,
    MessageEmbed
} = require("discord.js");

const client = new Client({
    disableEveryone: true
});

module.exports = {
    name: "bitskins",
    category: "priceCheck",
    description: "Checks the price of an item on bitskins market.",
    run: async(client, message, args) => {
        /*
        api.getAllItemPrices(true).then((data) => {
            console.log(data);
        }).catch(console.error());
        setTimeout(function() {console.log("5");}, 5000);
        */
       api.getMarketData('★ karambit Knife | Urban Masked (Well-Worn)').then((data) => {
           console.log(data);
       });
         
    }
}