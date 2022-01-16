const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js')
var index = [];
async function fetchIndex() {
    index = [];
    const urlt = `https://sheets.googleapis.com/v4/spreadsheets/1emW2Zsb0gEtEHiub_YHpazvBd4lL4saxCwyPhbtxXYM/values/TV?key=${process.env.SheetsApi}`
    const urlm = `https://sheets.googleapis.com/v4/spreadsheets/1emW2Zsb0gEtEHiub_YHpazvBd4lL4saxCwyPhbtxXYM/values/Movies?key=${process.env.SheetsApi}`
    await fetch(urlt).then(handleResponse)
        .then(handleData)
        .catch(handleError);
    await fetch(urlm).then(handleResponse)
        .then(handleData)
        .catch(handleError);
    console.log(`${index.length} values fetched from Certain Smoke's Index`)
    async function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }
    async function handleData(data) {
        index = index.concat(data.values);
    }
    async function handleError(e) {
        console.log(e)
    }
}

module.exports = {
    execute: async function (message) {
        if (index.length == 0) await fetchIndex();
        const query = message.content.substring(4).trim();
        const results = [];
        index.forEach(async element => {
            if (element[1]) if (element[1].includes("Anime Index")) return;
            if (element[1]) if (element[1].toLowerCase().includes(query)) { results.push(element); return; }
            if (element[2]) if (element[2].toLowerCase().includes(query)) { results.push(element); return; }
        });
        const length = results.length;
        if (length == 0) {
            await message.channel.send("No results")
            return;
        }
        let i = 0;
        console.log(results)
        var output = await getresults(i);
        try {
            const msg = await message.reply({ embeds: [output] })
            if (parseInt(length) == 1)
                return;
            await msg.react('◀️')
            await msg.react('▶️')
            const filter = (reaction, user) => {
                return reaction.emoji.name === '▶️' || reaction.emoji.name === '◀️' && user.id === message.author.id;
            };

            const collector = msg.createReactionCollector({ filter, time: 120000 });

            collector.on('collect', async (reaction, user) => {
                switch (reaction.emoji.name) {
                    case '▶️': output = await getresults(++i); if (output) await msg.edit({ embeds: [output] }); break;
                    case '◀️': output = await getresults(--i); if (output) await msg.edit({ embeds: [output] }); break;
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        async function getresults(i) {
            try {
                if (i < 0)
                    i = parseInt(length) + parseInt(i);
                if (i > parseInt(length) - 1)
                    i = 0;
                res = results[i];
                var output = new MessageEmbed().setTitle((res[1].trim().length != 0) ? res[1].toUpperCase() : res[2].toUpperCase()).setColor('#e3b811');
                output.setDescription("\n");
                if (res[3]) if (res[3].trim().length != 0) output.addFields({ name: '*Best Release*', value: res[3] });
                if (res[4]) if (res[4].trim().length != 0) output.addFields({ name: '*Alternate Release*', value: res[4] });
                if (res[5]) if (res[5].trim().length != 0) output.addFields({ name: '*Dual Audio*', value: res[5] });
                if (res[6]) if (res[6].trim().length != 0) output.addFields({ name: '*Notes*', value: res[6] });
                if (res[7]) if (res[7].trim().length != 0) output.addFields({ name: '*Comparisons*', value: res[7] });
                return output;
            } catch (error) {
                console.log(error)
            }
        }
    },
    fetchIndex
}