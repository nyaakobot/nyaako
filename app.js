const { Client, Intents, MessageEmbed, MessageAttachment, Collection, VoiceChannel } = require('discord.js');
const token =process.env.DiscordToken;
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const botCommands = require('./commands/index');

const mess= "`;addreply <Keywords> -r <ReplyMessage>`\tadd a custom bot reply.\n\
`;deletereply <Keywords>`\tdelete a custom bot reply.\n\
`;addreact <Keywords> -r <:emote>`\tadd a custom bot reaction.\n\
`;deletereact <Keywords>`\tdelete a custom bot reaction.\n\
`;anime <SearchQuery>`\tfind anime from Anilist.\n\
`;manga <SearchQuery>`\tfind manga from Anilist.\n\
`;ud <SearchQuery>`\tfind definitions from Urban Dictionary.\n\
`;nyaa <SearchQuery>`\tfind torrents from nyaa.si.\n\
`;nyaa -s <SearchQuery>`\tfind torrents from nyaa.si by Size (Descending).\n\
`;nyaa -s! <SearchQuery>`\tfind torrents from nyaa.si by Size (Ascending).\n\
`;nyaa -p <SearchQuery>`\tfind torrents from nyaa.si by Seeds (Descending).\n\
`;nyaa -p! <SearchQuery>`\tfind torrents from nyaa.si by Seeds (Ascending).\n\
`;i <no.>`\tget more info about a torrent from the search results.\n\
`;m <no.>`\tget magnet link of a torrent from the search results.\n\
`;d <no.>`\tdownload a torrent from the search results."
express().listen(PORT, () => console.log(`Listening on ${ PORT }`));

const prefix=';';

const bot = {
    client: new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_VOICE_STATES]}),
    log: console.log,
}

bot.client.on('messageCreate',async function(message) {
	if(message.content.startsWith('∞-')){
		var num=parseInt(message.content.substring(2))+1;
		message.channel.send('∞-'+num);
	}
	if(message.content.startsWith(prefix)){
		const args = message.content.split(/ +/)
		const command = args.shift().toLowerCase().slice(1)
		switch(command){
			case 'nyaa':
			case 'more':
			case 'd':
			case 'i':
			case 'm': await botCommands.nyaa.execute(message);break;
			case 'anime':
			case 'manga': await botCommands.al.execute(message);break;
			case 'addreply': await botCommands.replies.add(message);break;
			case 'deletereply': await botCommands.replies.remove(message);break;
			case 'addreact': await botCommands.replies.addReactions(message);break;
			case 'deletereact': await botCommands.replies.removeReactions(message);break
			case 'character': await botCommands.character.execute(message);break
			case 'play': await botCommands.player.execute(message,VoiceChannel);break;
			case 'help':
				var output = new MessageEmbed().setDescription(mess).setColor('#e3b811');
				await message.channel.send({embeds:[output]});
				break;
			case 'ud': await botCommands.ud.execute(message);break;	
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
bot.client.on('ready',()=> {
	console.log("Ready") 
   })
bot.load();
