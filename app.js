const { Client, Intents, MessageEmbed, VoiceChannel } = require('discord.js');
const token =process.env.DiscordToken;
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

const botCommands = require('./commands/index');

const mess= "**CUSTOM MESSAGES/REACTIONS**\n\
`;addreply <Keywords> -r <ReplyMessage>`\tadd custom bot reply.\n\
`;deletereply <Keywords>`\tdelete custom bot reply.\n\
`;addreact <Keywords> -r <:emote>`\tadd custom bot reaction.\n\
`;deletereact <Keywords>`\tdelete custom bot reaction.\n\
\n\
 **ANILIST**\n\
`;anime <SearchQuery>`\tfind anime from Anilist.\n\
`;manga <SearchQuery>`\tfind manga from Anilist.\n\
*Parameters (to be used after search query)*\n\
`-g <genre1,genre2,...>`\tfilter results by genres.\n\
`-t <tag1,tag2,...>`\tfilter results by tags.\n\
`-p`\tsort results by popularity.\n\
`-s`\tsort results by score.\n\
\n\
**DICTIONARY**\n\
`;romaji <SearchQuery>`\tfind romaji word meanings.\n\
`;ud <SearchQuery>`\tfind definitions from Urban Dictionary.\n\
`;nyaa <SearchQuery>`\tfind torrents from nyaa.si.\n\
\n\
**NYAA.SI SEARCH**\n\
`;nyaa <SearchQuery>`\tfind torrents from nyaa.si.\n\
*Parameters\n\
`-s`\tsort results by Size (Descending).\n\
`-s!`\tsort results by Size (Ascending).\n\
`-p`\tsort results by Seeders (Descending).\n\
`-p!`\tsort results by Seeders (Ascending).\n\
*Options*\n\
`;i <no.>`\tview description.\n\
`;c <no.>`\tview comments.\n\
`;m <no.>`\tget magnet link.\n\
`;d <no.>`\tdownload."
express().listen(PORT, () => console.log(`Listening on ${ PORT }`));

const prefix=';';

const bot = {
    client: new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_VOICE_STATES]}),
    log: console.log,
}

bot.client.on('messageCreate',async function(message) {
	if(message.content.startsWith('∞-')){
		setTimeout(async ()=>{
			var num=parseInt(message.content.substring(2))+1;
			message.channel.send('∞-'+num);	
		},'3000')
		}
	if(message.content.startsWith(prefix)){
		const args = message.content.split(/ +/)
		const command = args.shift().toLowerCase().slice(1)
		switch(command){
			case 'nyaa':
			case 'more':
			case 'd':
			case 'i':
			case 'c':
			case 'm': await botCommands.nyaa.execute(message);break;
			case 'anime':
			case 'manga': await botCommands.al.execute(message);break;
			case 'addreply': await botCommands.replies.add(message);break;
			case 'deletereply': await botCommands.replies.remove(message);break;
			case 'addreact': await botCommands.replies.addReactions(message);break;
			case 'deletereact': await botCommands.replies.removeReactions(message);break
			case 'character': await botCommands.character.execute(message);break
			case 'romaji': await botCommands.nihon.execute(message);break;
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
