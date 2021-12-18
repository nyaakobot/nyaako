const { Client, Intents, MessageEmbed, MessageAttachment, Collection } = require('discord.js');
const token ="ODk5MjI0MDA1NjMzMDA3NjU2.YWvpnQ.HgVhwuIvgEmuPyLkYJJmWpxjXnw" //process.env.DiscordToken;
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
	 if (!message.content.startsWith(prefix)) return

	 const args = message.content.split(/ +/)
	 // get the first word (lowercase) and remove the prefix
	 const command = args.shift().toLowerCase().slice(1)
	 switch(command){
		 case 'nyaa': botCommands.nyaa.execute(message); console.log("ping"); break;
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