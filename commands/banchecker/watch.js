const SteamAPI = require('steamapi');
const fs = require("fs");
const steam = new SteamAPI('B5C1ECC7CD233987368DA4157C7806EB');
const regex = RegExp('(?:https?:\/\/)?steamcommunity\.com\/(?:profiles|id)\/[a-zA-Z0-9_-]+');

// CUSTOM
var {
    unbannedP,
    announceP,
    watchP
} = require('./db/path.json');

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

module.exports = {
    name: "watch",
    category: "banchecker",
    description: "Adds steam account to watchlist and notifies when the account gets banned.",
    run: async (client, message, args) => {
        var i = 0;
        args = args.join(" ").replace(/\n/g, " ").split(" ");
        while (args[i]) {
            sid = args[i];
            i++;
            if (!sid.length) {
                return message.channel.send(`[ ${message.author} ] You didn't provide any arguments!`);
            } else {
                if (regex.test(sid)) {
                    steam.resolve(`${sid}`).then(id => {
                        
                        //message.channel.send(`[ ${message.author} ] Profile added to watchlist: ${id} \n You will be notified when the player gets banned. \n Kindly allow direct messages from this server. `);

                        fs.readFile(watchP, 'utf8', (err, filestring) => {
                            if (err) {
                                console.log("File read failed:", err)
                                return
                            }
                            var userExists = 0;
                            var profileReported = 0;
                            const record = filestring.replace(/\n/g, " ").split(" ");
                            if (filestring) {
                                //console.log(id);
                                console.log("watch.json not empty");


                                for (j in record) {
                                    //already reported by same user
                                    if (record[j]) {
                                        //console.log(record[j]);
                                        const recc = JSON.parse(record[j]);
                                        //console.log(recc);
                                        var users = recc.user.split("|");
                                        //console.log(users);
                                        if (recc.steamurl == id) {
                                            profileReported = 1;
                                            var u = 0;
                                            while (users[u]) {
                                                if (users[u] == `${message.author}`) {
                                                    userExists = 1;
                                                    message.channel.send(`[ ${message.author} ] You already reported the Player.`);
                                                    //sleep(3000);
                                                    break;
                                                }
                                                u++;
                                            }
                                            if (userExists == 1) {
                                                break;
                                            }
                                        }
                                    }
                                }


                                //Profile reported but not by the same user.
                                if (profileReported == 1) {
                                    if (userExists == 0) {
                                        message.channel.send(`[ ${message.author} ] Profile added to watchlist: ${id} \n You will be notified when the player gets banned. \n Kindly allow direct messages from this server. `);
                                        fs.readFile(watchP, 'utf8', (err, filestring) => {
                                            if (err) {
                                                console.log("File read failed:", err)
                                                return
                                            }
                                            const record = filestring.replace(/\n/g, " ").split(" ");
                                            console.log("Profile reported but not by the same user.")
                                            insertarr = Array();
                                            for (j in record) {
                                                if (record[j]) {
                                                    const recc = JSON.parse(record[j]);
                                                    //console.log(recc);
                                                    if (recc.steamurl == id) {
                                                        var users = recc.user.split("|");
                                                        users.push(`${message.author}`);
                                                        userstring = users.join("|");
                                                        temp = JSON.stringify({
                                                            user: userstring,
                                                            steamurl: id
                                                        });
                                                        insertarr.push(temp);
                                                    }
                                                    else {
                                                        temp = JSON.stringify({
                                                            user: recc.user,
                                                            steamurl: recc.steamurl
                                                        });
                                                        insertarr.push(temp);
                                                    }
                                                }
                                            }

                                            //console.log(insertarr);
                                            var insertstring = insertarr.join("\n")
                                            fs.writeFile(watchP, insertstring + "\n", function () { });
                                            //sleep(3000);
                                        });
                                    }
                                }



                                if (profileReported == 0) {
                                    console.log('Progile never reported.');
                                    message.channel.send(`[ ${message.author} ] Profile added to watchlist: ${id} \n You will be notified when the player gets banned. \n Kindly allow direct messages from this server. `);
                                    temp = JSON.stringify({
                                        user: `${message.author}`,
                                        steamurl: id
                                    });
                                    //console.log(temp);
                                    fs.appendFile(watchP, temp + "\n", (err) => {
                                        if (err) console.error(err)
                                    });
                                    //sleep(3000);
                                }

                            }
                            else {
                                console.log("watch.json is empty");
                                message.channel.send(`[ ${message.author} ] Profile added to watchlist: ${id} \n You will be notified when the player gets banned. \n Kindly allow direct messages from this server. `);
                                users = Array();
                                users.push(`${message.author}`)
                                var userstring = users.join(" ")
                                temp = JSON.stringify({
                                    user: userstring,
                                    steamurl: id
                                });
                                //console.log(temp);
                                fs.appendFile(watchP, temp + "\n", (err) => {
                                    if (err) console.error(err)
                                });
                                //sleep(3000);
                            }
                        });
                        
                    }, reason => {
                        message.channel.send(`[ ${message.author} ] Please enter a valid profile link.`);
                    });
                } else {
                    message.channel.send(`[ ${message.author} ] Please enter a valid profile link.`);
                }
            }
            
        }
    }
}