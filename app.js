const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', (message) => {
	if (message.content ==='=greet')
		message.channel.send({content: 'Hello Everynyan! How are you? Fine. Sankyu'});
	if (message.content ==='=help')
		message.channel.send({content: 'Commands - \n=greet\n=nyaa'});
	if (message.content.startsWith('=nyaa'))
	{	
		var s=message.content.substring(6);
		if(s.trim().length==0)
			message.channel.send({content: 'no search parameters entered'});
		else
			message.channel.send({content: s});
	}})


// Login to Discord with your client's token
client.login(token);
