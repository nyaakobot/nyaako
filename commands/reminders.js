const mongoose = require('mongoose');
const uri = process.env.MongoSecret
const Reminders = require('../models/reminders')
const { MessageEmbed } = require('discord.js');
mongoose.connect(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected to Mongo");
});
const calcTime = (num, unit) => {
    switch (unit) {
        case 'hrs':
        case 'hr':
        case 'h':
        case 'hour':
        case 'hours': return parseInt(num) * 60 * 60 * 1000; break;
        case 'mins':
        case 'm':
        case 'min':
        case 'minute':
        case 'minutes': return parseInt(num) * 60 * 1000; break;
        case 'day':
        case 'days':
        case 'd': return parseInt(num) * 24 * 60 * 60 * 1000; break;
        case 'M':
        case 'month':
        case 'months': return parseInt(num) * 24 * 30 * 60 * 60 * 1000; break;
        case 'weeks':
        case 'week':
        case 'w': return parseInt(num) * 7 * 24 * 60 * 60 * 1000; break;
        case 'y':
        case 'year':
        case 'years': return parseInt(num) * 365 * 24 * 60 * 60 * 1000; break
        default: return -1;
    }
}
const parseVerbalCommand = (params, createdTimestamp) => {
    let num = 0, c = 0, i = 0, unit = 0, msg = undefined, time = 0;
    if (!params[2].charAt(0).match(/\d/)) return;
    num = (params[2].match(/\d+/)) ? params[2].match(/\d+/)[0] : 0;
    unit = (params[2].match(/\D+/)) ? params[2].match(/\D+/)[0] : 0;
    console.log(num, unit)
    c = calcTime(num, unit)
    i = 3;
    if (c < 0) i++
    if (c < 0) c = calcTime(num, params[3])
    if (c < 0) return;
    if (params[i] === 'to' || params[i] === 'that') msg = params.slice(++i).join(' ')
    time = createdTimestamp + c;
    return { time, msg }
}
module.exports = {
    create: async (message) => {
        const { channelId, createdTimestamp } = message;
        const userId = message.author.id;
        const params = message.content.split(' ');
        const msgId = message.id;
        let time = createdTimestamp + parseInt(params[1])
        let msg = params[2]
        if (!params[1]) return;
        if (params[1] === 'in') {
            let items = parseVerbalCommand(params, createdTimestamp)
            time = items.time;
            msg = items.msg;
        }
        else {
            if (!params[1].charAt(0).match(/\d/)) return;
            let num = 0, c = 0, i = 0, unit = 0;
            if (!params[1].charAt(i).match(/\d/)) return;
            num = (params[1].match(/\d+/)) ? params[1].match(/\d+/)[0] : 0;
            unit = (params[1].match(/\D+/)) ? params[1].match(/\D+/)[0] : 0;
            c = calcTime(num, unit)
            i = 2;
            if (c < 0) i++
            if (c < 0) c = calcTime(num, params[2])
            if (c > 0) time = createdTimestamp + c
        }
        var query = await Reminders.create({ channelId, userId, time, msg, msgId })
        const reply = await message.reply('alright');
        console.log(query)
    },
    view: async (message) => {
        try {
            var results = await Reminders.find({ userId: message.author.id }).sort({ time: 1 })
            var desc = "\n"
            if (results.length <= 0) { await message.reply("None"); return; }
            let i = 0;
            const sent = await message.reply({ embeds: [await buildEmbeds()] })
            if (parseInt(results.length) <= 10)
                return;
            await sent.react('◀️')
            await sent.react('▶️')
            const filter = (reaction, user) => {
                return reaction.emoji.name === '▶️' || reaction.emoji.name === '◀️' && user.id === message.author.id;
            };

            const collector = sent.createReactionCollector({ filter, time: 120000 });

            collector.on('collect', async (reaction, user) => {
                switch (reaction.emoji.name) {
                    case '▶️': i = i + 10; await sent.edit({ embeds: [await buildEmbeds()] }); break;
                    case '◀️': i = i - 10; await sent.edit({ embeds: [await buildEmbeds()] }); break;
                }
            });
            async function buildEmbeds() {
                if (i < 0)
                    i = parseInt(results.length) + parseInt(i);
                if (i > parseInt(results.length) - 1)
                    i = 0;
                var output = new MessageEmbed().setTitle('Your Upcoming Reminders');
                var desc = "";
                for (let c = parseInt(i) + 1; c < parseInt(i) + 11; c++) {
                    if (results.length > c) {
                        let cdate = (new Date(results[c].time))
                        let ctime = cdate.getHours() + " " + cdate.getMinutes()
                        desc = desc + `**${c}. ${results[c].msg}**\n*${cdate}*\n\n`
                    }
                    else
                        break;
                }
                output.setDescription(desc).setColor('#e3b811');
                return output;
            }
        }
        catch (e) {
            console.error(e)
        }
    }
}
