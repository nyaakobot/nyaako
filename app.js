const { Client, Intents, MessageEmbed, MessageAttachment, Collection } = require('discord.js');
const token =process.env.DiscordToken;
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require('util');
const readFile = util.promisify(fs.readFile);
const { table } = require('console');
const http = require('http');
const { getServers } = require('dns');
const { getCipherInfo } = require('crypto');
const { convert } = require('html-to-text');
const botCommands = require('./commands/index');
express().listen(PORT, () => console.log(`Listening on ${ PORT }`));
const prefix=';';

const bot = {
    client: new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS]}),
    log: console.log,
}

bot.client.on('messageCreate',async function(message) {
	 // ignore all other messages without our prefix
	 if (message.content=== 'nyaa')
		await botCommands.nyaa.ping(message);
	 else if (message.content.includes('yo mom'))
		await message.channel.send({content : 'https://imgur.com/3HbEeOA'});
	 else if (!message.content.startsWith(prefix)) return

	 const args = message.content.split(/ +/)
	 // get the first word (lowercase) and remove the prefix
	 const command = args.shift().toLowerCase().slice(1)
	 switch(command){
	    case 'nyaa':
		case 'more':
		case 'd':
		case 'i':
		case 'm':
			await botCommands.nyaa.execute(message);break;
		case 'anime':
		case 'manga': await botCommands.al.execute(message);break;
		case 'help':
			const mess= "`;anime <SearchQuery>`\tfind anime from Anilist.\n\
			`;manga <SearchQuery>`\tfind manga from Anilist.\n\
			`;ud <SearchQuery>`\tget definitions from Urban Dictionary.\n\
			`;nyaa <SearchQuery>`\tfetch results from nyaa in default sorting order (By Date).\n\
			`;nyaa <SearchQuery> -s`\tfetch results from nyaa by Size (Descending).\n\
			`;nyaa <SearchQuery> -s!`\tfetch results from nyaa by Size (Ascending).\n\
			`;nyaa <SearchQuery> -p`\tfetch results from nyaa by Seeds (Descending).\n\
			`;nyaa <SearchQuery> -p!`\tfetch results from nyaa by Seeds (Ascending).\n\
			`;i <no.>`\tget more info about a torrent from the fetched results.\n\
			`;m <no.>`\tget magnet link of a torrent from the fetched results.\n\
			`;d <no.>`\tdownload a torrent from the fetched results."
			var output = new MessageEmbed().setDescription(mess).setColor('#e3b811');
			await message.channel.send({embeds:[output]});
			break;
		case 'ud': await botCommands.ud.execute(message);break;	
	 }
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
