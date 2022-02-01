const { Client, Intents } = require('discord.js');
const token = process.env.DiscordToken;
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const botCommands = require('./commands/index');
const cp = require('child_process')
var child = cp.fork('./workers/worker1.js');
child.on('message', async (queries) => {
	try {
		for (const i of queries) {
			await bot.client.channels.fetch(i.channelId).then(channel => channel.send(`<@${i.userId}> ${i.msg}`))
			console.log(i.userId, "reminded msg=>", i.msg)
		}
	}
	catch (e) {
		console.log(e)
	}
});
child.on('close', (code) => {
	console.log(`child process exited with code ${code}`);
});
express().listen(PORT, () => console.log(`Listening on ${PORT}`));

const prefix = '`';

const bot = {
	client: new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES] }),
	log: console.log,
}

bot.client.on('messageCreate', async function (message) {
	// if (message.content.startsWith('bleep') && checkUser(message.author.id)) {
	// 	setTimeout(async () => {
	// 		await botCommands.reminders.check(bot.client)
	// 		message.channel.send('bleep')
	// 	}, '5000')
	// }
	if (message.content.startsWith(prefix)) {
		const args = message.content.split(/ +/)
		const command = args.shift().toLowerCase().slice(1)
		switch (command) {
			case 'nyaa':
			case 'more':
			case 'd':
			case 'i':
			case 'c':
			case 'af':
			case 'm': await botCommands.nyaa.execute(message); break;
			case 'remindme': await botCommands.reminders.create(message); break;
			case 'reminders': await botCommands.reminders.view(message);break;
			case 'anime':
			case 'manga': await botCommands.al.execute(message); break;
			case 'addreply': await botCommands.replies.add(message); break;
			case 'deletereply': await botCommands.replies.remove(message); break;
			case 'addreact': await botCommands.replies.addReactions(message); break;
			case 'deletereact': await botCommands.replies.removeReactions(message); break
			case 'character': await botCommands.character.execute(message); break
			case 'romaji': await botCommands.nihon.execute(message); break;
			case 'whats': await botCommands.english.execute(message); break;
			case 'help': await botCommands.help.execute(message); break;
			case 'br': await botCommands.br.execute(message); break;
			case 'ud': await botCommands.ud.execute(message); break;
		}
	}
	await botCommands.replies.check(message);
});

bot.load = function load() {
	this.log('Connecting...')
	this.client.login(token)
}
bot.client.on('ready', async () => {
	console.log("Ready")
	await botCommands.br.fetchIndex();
	child.send({ message: "start" });

})
bot.load();