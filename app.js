const { Client, Intents } = require('discord.js');
const token = process.env.DiscordToken;
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const botCommands = require('./commands/index');
const checkUser=(id)=>{
	const wl=['899224005633007656','925691274751774720','457483972277174272']
	return wl.find((e)=>{
		if(id===e) return true
	})
}
express().listen(PORT, () => console.log(`Listening on ${PORT}`));

const prefix = ';';

const bot = {
	client: new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES] }),
	log: console.log,
}

bot.client.on('messageCreate', async function (message) {
	if (message.content.startsWith('beep')&&checkUser(message.author.id)) {
		setTimeout(async () => {
			await botCommands.reminders.check(bot.client)
			message.channel.send('beep')
		}, '5000')
	}
	if (message.content.startsWith(prefix)) {
		const args = message.content.split(/ +/)
		console.log(message.channelId)
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
	this.log('Loading commands...')
	console.log(botCommands);
	this.log('Connecting...')
	this.client.login(token)
}
bot.client.on('ready', async () => {
	console.log("Ready")
	await botCommands.br.fetchIndex();
	await bot.client.channels.fetch('937798021712859156').then(channel => channel.send('beep'))
})
bot.load();