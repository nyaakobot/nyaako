const { Client, Intents, MessageEmbed, MessageAttachment, Collection } = require('discord.js');
const token = process.env.DiscordToken;
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
	 if (message.content.includes('yo mom'))
	 {
		 await message.channel.send({content : 'https://imgur.com/3HbEeOA'});
	 }else if (!message.content.startsWith(prefix)) return

	 const args = message.content.split(/ +/)
	 // get the first word (lowercase) and remove the prefix
	 const command = args.shift().toLowerCase().slice(1)
	if(command=='nyaa'||command=='more'||command=='d'||command=='i'||command=='m'){
		 await botCommands.nyaa.execute(message); 
	}
	else if (command=='help')
    	{
        await message.channel.send({content : ';nyaa <SearchQuery>       //fetch results from nyaa in default sorting order (By Date)\
		;nyaa <SearchQuery> -s    //fetch results from nyaa in sorting order - by Size (Descending)\
		;nyaa <SearchQuery> -s!   //fetch results from nyaa in sorting order - by Size (Ascending)\
		;nyaa <SearchQuery> -p    //fetch results from nyaa in sorting order - by Seeds (Descending)\
		;nyaa <SearchQuery> -p!   //fetch results from nyaa in sorting order - by Seeds (Ascending)\
		;i <no.>            //get more info about a torrent from the fetched results\
		;m <no.>            //get magnet link of a torrent from the fetched results.\
		;d <no.>            //download a torrent from the fetched results.'});
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
