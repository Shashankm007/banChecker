const {
    Client,
    Collection
} = require("discord.js");
const fs = require("fs");

var {
    announceP
} = require('./db/path.json');

const client = new Client({
    disableEveryone: true
});

module.exports = {
    name: "announce",
    category: "banchecker",
    description: "Selects the ban announcement channel.",
    run: async(client, message, args) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            var already = false;
            var cid = message.channel.id;
            //console.log(cid);
            fs.readFile(announceP, 'utf8', (err, ann) => {
                if (err) {
                    //console.log("File read failed:", err);
                    temp = JSON.stringify({
                        channelId: `${cid}`
                    });                   
                    fs.appendFile(announceP, temp + "\n", (err) => {
                        if (err) 
                        {
                            //console.error(err);
                        }
                    });
                    message.channel.send(`[ ${message.author} ] This channel has been set to announce bans!`); 
                    return
                }
                const announcech = ann.replace( / /, "\n" ).split("\n");
                //console.log(ann);
                var j = 0;
                while (announcech[j]) {
                    channdata = announcech[j];
                    let channeldata = JSON.parse(channdata);
                    j++;  
                    if (channeldata.channelId == cid) {
                        already = true;
                        //console.log('nn');
                        message.channel.send(`[ ${message.author} ] You have already set this channel to announce bans!`);
                    }                 
                }
                if (!already) {
                    temp = JSON.stringify({
                        channelId: `${cid}`
                    });
                    //console.log(temp);
                    fs.appendFile(announceP, temp + "\n", (err) => {
                        if (err) console.error(err)
                    });
                    message.channel.send(`[ ${message.author} ] This channel has been set to announce bans!`);
                }
            });

        } else {
            message.channel.send(`[ ${message.author} ] You dont have permission to use this command.`);
        }
    }
}