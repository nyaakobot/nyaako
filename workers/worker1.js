process.on('message', function ({message}) {
    console.log("worker1 up and runniong")
    const { Client, Intents } = require('discord.js');
    const client=new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })
    const { check } = require('../commands/reminders.js')
    client.login(process.env.DiscordToken)
    setInterval(async () => {  
        await check(client);        
    }, '5000')
});
