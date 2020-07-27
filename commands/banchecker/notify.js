const SteamAPI = require('steamapi');
const {
    Client,
    MessageEmbed
} = require("discord.js");
const fs = require("fs");
const steam = new SteamAPI('B5C1ECC7CD233987368DA4157C7806EB');
const token = require('../../config.json');

const client = new Client({
    disableEveryone: true
});

client.login(token.token);

// CUSTOM
var {
    unbannedP,
    announceP,
    watchP
} = require('./db/path.json');
const cd = 20000;
const customfooter = "";



function test() {
    var filestring = "";
    fs.readFile(watchP, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        const record = jsonString.replace(/ /g, "\n").split("\n");
        var i = 0;
        var count = 0;
        while (record[i]) {
            count += 1;
            let report = JSON.parse(record[i]);
            steam.getUserBans(report.steamurl).then(summary => {
                if (summary.vacBans > 0) {
                    steam.getUserSummary(report.steamurl).then(summary2 => {
                        const banEmbed = new MessageEmbed()
                            .setColor('#ff0026')
                            .setTitle(summary2.url) // Profile URL
                            .setURL(summary2.url) //Profile Link
                            .setAuthor(summary2.steamID) // Profile Name
                            .setDescription('TYPE: VAC Ban') // Ban Type
                            .setThumbnail(summary2.avatar.large) // ProfilePic
                            .setTimestamp()
                            .setFooter(customfooter);

                        var users = report.user;
                        usersarr = users.split("|");
                        for (i in usersarr) {
                            mention = usersarr[i];
                            let id = mention.replace(/[<@!>]/g, '');
                            client.users.fetch(id).then(user => {
                                user.send(banEmbed);
                            })
                        }
                        fs.readFile(announceP, 'utf8', (err, ann) => {
                            if (err) {
                                console.log("File read failed:", err)
                                return
                            }
                            const announcech = ann.replace(/ /, "\n").split("\n");
                            var j = 0;
                            while (announcech[j]) {
                                let channdata = JSON.parse(announcech[j]);
                                const channel = client.channels.cache.get(channdata.channelId);
                                try {
                                    channel.send(banEmbed);
                                    j++;
                                }
                                catch (err) {
                                    //console.log(err);
                                    j++;
                                    continue;
                                }
                            }
                        });
                    });
                } else if (summary.gameBans > 0) {
                    steam.getUserSummary(report.steamurl).then(summary2 => {
                        const banEmbed = new MessageEmbed()
                            .setColor('#ff0026')
                            .setTitle(summary2.url) // Profile URL
                            .setURL(summary2.url) //Profile Link
                            .setAuthor(summary2.steamID) // Profile Name
                            .setDescription('TYPE: Game Ban') // Ban Type
                            .setThumbnail(summary2.avatar.large) // ProfilePic
                            .setTimestamp()
                            .setFooter(customfooter);

                        var users = report.user;
                        usersarr = users.split("|");
                        for (i in usersarr) {
                            mention = usersarr[i];
                            let id = mention.replace(/[<@!>]/g, '');
                            client.users.fetch(id).then(user => {
                                user.send(banEmbed);
                            })
                        }
                        fs.readFile(announceP, 'utf8', (err, ann) => {
                            if (err) {
                                console.log("File read failed:", err)
                                return
                            }
                            const announcech = ann.replace(/ /, "\n").split("\n");
                            var j = 0;
                            while (announcech[j]) {
                                let channdata = JSON.parse(announcech[j]);
                                const channel = client.channels.cache.get(channdata.channelId);
                                try {
                                    channel.send(banEmbed);
                                    j++;
                                }
                                catch (err) {
                                    //console.log(err);
                                    j++;
                                    continue;
                                }
                            }
                        });
                    });
                }
                else {
                    //console.log("else part");
                    temp = JSON.stringify({
                        user: report.user,
                        steamurl: report.steamurl
                    });
                    //console.log(temp);
                    filestring = filestring + temp.toString() + "\n";
                    fs.writeFile(unbannedP,filestring, function() {});
                    
                }
            });
            i++;
        }
        //fs.writeFile(watchP,filestring, function() {});
    });
    console.log("Everyone has been notified.");
    transfer();
    setTimeout(test, cd);
}

function transfer(){
    arr = Array();
    fs.readFile(unbannedP, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        console.log(jsonString);
        fs.writeFile(watchP,jsonString, function() {});
    });
    //setTimeout(transfer, cd);
}
function arrUnique(arr) {
    var cleaned = [];
    arr.forEach(function (itm) {
        var unique = true;
        cleaned.forEach(function (itm2) {
            if (_.isEqual(itm, itm2)) unique = false;
        });
        if (unique) cleaned.push(itm);
    });
    return cleaned;
}


//This part removes duplicates in unbanned.json
function deduplicate() {
    //console.log('Removing duplicates from unbanned.json');
    fs.readFile(unbannedP, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }

        const record = jsonString.split('\n');
        var i = 0;
        var arr = Array();
        while (record[i]) {
            var temp = JSON.parse(record[i]);
            arr.push(temp);
            i++;
        }
        var grades = {};
        arr.forEach(function (item) {
            var grade = grades[item.user] = grades[item.user] || {};
            grade[item.steamurl] = true;
        });

        var outputList = [];
        for (var grade in grades) {
            for (var domain in grades[grade]) {
                outputList.push({
                    user: grade,
                    steamurl: domain
                });
            }
        }

        var i = 0;
        fs.writeFile(watchP, '', function () { })
        fs.writeFile(unbannedP, '', function () { })
        while (outputList[i]) {
            report = outputList[i];
            temp = JSON.stringify({
                user: `${report.user}`,
                steamurl: report.steamurl
            });
            fs.appendFile(watchP, temp + "\n", (err) => {
                if (err) console.error(err)
            });
            i++;
        }
    });
}

module.exports = {
    name: "notify",
    category: "banchecker",
    description: "Mentions the user, when the Reported player is banned.",
    run: async (client, message, args) => { }
}
test();
//transfer();