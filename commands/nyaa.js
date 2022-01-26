const path = require('path');
const fetch = require('node-fetch')
const { MessageEmbed, MessageAttachment } = require('discord.js');
var data = null;
const availableFilters = {
    "AMV": "1_1",
    "Anime": "1_2",
    "AnimeNonEnglish": "1_3",
    "AnimeRaw": "1-4",
    "MusicLossless": "2_1",
    "MusicLossy": "2_2",
    "Literature": "3_1",
    "LiteratureNonEnglish": "3_2",
    "LiteratureRaw": "3_3",
    "LiveAction": "4_1",
    "LiveActionNonEnglish": "4_3",
    "LiveActionRaw": "4_4",
    "PV": "4_2",
    "Artworks": "5_1",
    "Pictures": "5_2",
    "Apps": "6_1",
    "Games": "6_2"
}
async function ping(message) {
    await message.reply({ content: 'nyaan' })
}

async function getResults(query, sortBy, order, filters) {
    try {
        var results = await fetch('https://nscrap.herokuapp.com/api/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query, sortBy, order, filters
            })
        }).then(handleResponse)
            .then(handleData);
        async function handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
        }
        async function handleData(data) {
            console.log(data.data.length + " records fetched")
            return data;
        }
        return results;
    } catch (e) {
        console.error(e)
    }
}

async function getInfo(id) {
    try {
        var res = await fetch('https://nscrap.herokuapp.com/api/torrentData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                id
            })
        }).then(handleResponse)
            .then(handleData);
        async function handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
        }
        async function handleData(data) {
            return data;
        }
        return res;
    } catch (e) {
        console.error(e)
    }
}

async function execute(message) {
    try {
        var msg = message.content.substring(1);
        if (msg === 'af') {
            let output = new MessageEmbed().setTitle("AVAILABLE FILTERS").setColor('#e3b811');
            let keys = Object.keys(availableFilters)
            console.log(keys)
            let desc="";
            keys.forEach(e=>{
                desc=desc+`\`${e}\` ,`;
            })
            output.setDescription(desc.substring(0,desc.length-2));
            await message.channel.send({embeds:[output]})
        }
        else if (msg.startsWith('m ')) {
            var s2 = msg.substring(msg.indexOf('m') + 2);
            const templ = data.data[parseInt(s2) - 1].mlink;
            await message.channel.send({ content: templ });
        }
        else if (msg.startsWith('i ')) {
            var s2 = msg.substring(msg.indexOf('i') + 2);
            const id = data.data[parseInt(s2) - 1].id;
            const res = await getInfo(id);
            var output = new MessageEmbed().setTitle(data.data[parseInt(s2) - 1].title).setColor('#e3b811');
            output.setDescription(res.description);
            await message.channel.send({ embeds: [output] });
        }
        else if (msg.startsWith('c ')) {
            var s2 = msg.substring(msg.indexOf('i') + 2);
            const id = data.data[parseInt(s2) - 1].id;
            const res = await getInfo(id);
            let i = 0;
            var output = new MessageEmbed().setTitle('Comments on "' + data.data[parseInt(s2) - 1].title + '"').setColor('#e3b811');
            await loadComments(i);
            const sm = await message.channel.send({ embeds: [output] });
            if (parseInt(res.comments.length) < 10)
                return;
            await sm.react('◀️')
            await sm.react('▶️')
            const filter = (reaction, user) => {
                return reaction.emoji.name === '▶️' || reaction.emoji.name === '◀️' && user.id === message.author.id;
            };

            const collector = sm.createReactionCollector({ filter, time: 120000 });

            collector.on('collect', async (reaction, user) => {
                switch (reaction.emoji.name) {
                    case '▶️': i = i + 10; await loadComments(); await sm.edit({ embeds: [output] }); break;
                    case '◀️': i = i - 10; await loadComments(); await sm.edit({ embeds: [output] }); break;
                }
            });
            async function loadComments() {
                if (i < 0)
                    i = parseInt(res.comments.length) + parseInt(i);
                if (i > parseInt(res.comments.length) - 1)
                    i = 0;
                if (res.comments.length == 0)
                    await message.channel.send({ content: 'No results' });
                var list = "\n\n\n";
                const set = res.comments.slice(i, i + 10)
                set.forEach(element => {
                    list = list + "**" + element.user + "**" + "\n> " + element.comment.replace(/\n/, "\n> ") + "\n\n";
                });
                output.setDescription(list);
            }

        }
        else if (msg.startsWith('d ')) {
            var s2 = msg.substring(msg.indexOf('d') + 2);
            const downl = data.data[parseInt(s2) - 1].dlink;
            await message.channel.send({ files: [downl] });
        }
        else if (msg.startsWith('nyaa ')) {
            var query = null, sortBy = null, order = null, filters = null;
            var params = msg.split(" ");
            let c = 0;
            if (params[1].startsWith('-')) {
                switch (params[1]) {
                    case '-p': order = 'desc'; sortBy = 'seeders'; c++; break;
                    case '-p!': order = 'asc'; sortBy = 'seeders'; c++; break;
                    case '-s': order = 'desc'; sortBy = 'size'; c++; break;
                    case '-s!': order = 'asc'; sortBy = 'size'; c++; break;
                    case '-f': filters = params[2]; c = c + 2; break;
                }
            }
            if (params[2].startsWith('-')) {
                switch (params[2]) {
                    case '-p': order = 'desc'; sortBy = 'seeders'; c++; break;
                    case '-p!': order = 'asc'; sortBy = 'seeders'; c++; break;
                    case '-s': order = 'desc'; sortBy = 'size'; c++; break;
                    case '-s!': order = 'asc'; sortBy = 'size'; c++; break;
                    case '-f': filters = params[3]; c = c + 2; break;
                }
            }
            if (params[3].startsWith('-')) {
                switch (params[3]) {
                    case '-p': order = 'desc'; sortBy = 'seeders'; c++; break;
                    case '-p!': order = 'asc'; sortBy = 'seeders'; c++; break;
                    case '-s': order = 'desc'; sortBy = 'size'; c++; break;
                    case '-s!': order = 'asc'; sortBy = 'size'; c++; break;
                }
            }
            query = params.slice(c + 1).join(' ');
            let i = 0;
            console.log(availableFilters[filters])
            data = await getResults(query, sortBy, order, availableFilters[filters]);
            if (data.data.length == 0) {
                await message.channel.send({ content: 'No results' });
                return;
            }
            var embeds = await buildEmbeds(data);
            const rem = await message.channel.send({ embeds: [embeds] });
            if (parseInt(data.data.length) == 1)
                return;
            await rem.react('◀️')
            await rem.react('▶️')
            const filter = (reaction, user) => {
                return reaction.emoji.name === '▶️' || reaction.emoji.name === '◀️' && user.id === message.author.id;
            };

            const collector = rem.createReactionCollector({ filter, time: 120000 });

            collector.on('collect', async (reaction, user) => {
                switch (reaction.emoji.name) {
                    case '▶️': i = i + 10; embeds = await buildEmbeds(data); await rem.edit({ embeds: [embeds] }); break;
                    case '◀️': i = i - 10; embeds = await buildEmbeds(data); await rem.edit({ embeds: [embeds] }); break;
                }
            });
            async function buildEmbeds(data) {
                try {
                    const results = data.data;
                    if (i < 0)
                        i = parseInt(results.length) + parseInt(i);
                    if (i > parseInt(results.length) - 1)
                        i = 0;
                    else {
                        var output = new MessageEmbed().setTitle('SEARCH RESULTS ');
                        var content = "";
                        for (let c = parseInt(i) + 1; c < parseInt(i) + 11; c++) {
                            if (results.length >= c) {
                                head = results[c - 1];
                                content = content + "**" + c + ". " + head.title + "**\n" + "*Seeds:* **" + head.seeders + "**\t*Leeches:* **" + head.leechers + "**\t*Size:* **" + head.size + "**\t*Date:* **" + head.dateAdded + "**\n\n";
                            }
                            else
                                break;
                        }
                        output.setDescription(content).setColor('#e3b811');
                        return output;
                    }
                }
                catch (e) {
                    console.log(e);
                    return
                }
            }
        }
    }
    catch (e) {
        console.log(e);
        await message.channel.send({ content: 'Err' });
    }
}

module.exports = {
    execute, ping
}
