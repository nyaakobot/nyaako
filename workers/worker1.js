const mongoose = require('mongoose');
const uri = process.env.MongoSecret
const Reminders = require('../models/reminders')
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })
const { check } = require('../commands/reminders.js')
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
process.on('message', function ({ message }) {
    try {
        console.log("worker1 up and running")
        client.login(process.env.DiscordToken)
        client.on('ready', async () => {
            setInterval(async () => {
                const currentTime = (new Date()).getTime()
                var queries = await Reminders.find({ time: { $lte: currentTime } })
                if (queries.length <= 0) return;
                for (const i of queries) {
                    await client.channels.fetch(i.channelId).then(channel => channel.send(`<@${i.userId}> ${i.msg}`))
                    console.log(i.userId, "reminded msg=>", i.msg)
                }
                var query2 = await Reminders.deleteMany({ time: { $lte: currentTime } })
            }, '10000')
        });
    }
    catch (e) {
        console.log(e)
    }
});
