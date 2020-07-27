const {
    Client,
    Collection
} = require("discord.js");
const fs = require("fs");

var {
    announceP ,
    tempannounceP
} = require('./db/path.json');

const client = new Client({
    disableEveryone: true
});

module.exports = {
    name: "dontannounce",
    category: "commands",
    description: "Removes a Channel from Ban announcements.",
    run: async (client, message, args) => {
        if (message.member.hasPermission('ADMINISTRATOR'))
        {
            var already = false;
            var cid = message.channel.id;
            //console.log(cid);
            try{
            fs.readFile(announceP, 'utf8', (err, ann) => {
                if (err) {
                    //console.log("File read failed:", err)
                    message.channel.send(`[ ${message.author} ] This channel do not announce bans!`); 
                    return
                }
                destarr = new Array();
                const announcech = ann.replace( / /, "\n" ).split("\n");
                for (i in announcech)  {
                    if (announcech[i] == "")
                    {
                        continue;
                    } 
                    else{
                        let channeldata = JSON.parse(announcech[i]);
                    //console.log(`${channeldata.channelId} , ${cid}`);
                    if (channeldata.channelId != cid) {
                        destarr.push(announcech[i]);                       
                    }
                    }
                }
                fs.writeFile(announceP,"",function() {});
                for (i in destarr)
                {
                    fs.appendFile(announceP, destarr[i] + "\n", function() {}
                    );
                }
                 message.channel.send(`[ ${message.author} ] Now, This channel does not announce bans!`);                
            });
        }
        finally{

        }
        }
        else {
            message.channel.send(`[ ${message.author} ] You dont have permission to use this command.`);
        }
    }    
}