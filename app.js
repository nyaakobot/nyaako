const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { table } = require('console');
express().listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', (message) => {
	if (message.content ==='hello')
		message.channel.send({content: 'Hello Everynyan! How are you? Fine. Sankyu'});
	if (message.content ==='help')
		message.channel.send({content: 'no'});
	if (message.content.startsWith('nyaa'))
	{	
		var s=message.content.substring(5);
		if(s.trim().length==0)
			message.channel.send({content: 'no search parameters entered'});
		else
		{
			var ns="";
			for(i=0;i<s.length;i++)
			{
				if(s.charAt(i)==' ')
				{
					ns=ns+"+";
				}
				else{
					ns=ns+s.charAt(i);
				}
			}
			message.channel.send({content: "searching "+ns})
			const Sc=scrapNyaa("https://nyaa.si/?f=0&c=0_0&q="+s);
		}
	}})


// Login to Discord with your client's token
client.login(token);
async function scrapNyaa(url){
	const { data } = await axios.get(url);
	const $ = cheerio.load(data);
	const tabl = $(".table-responsive table tbody tr");
	const count = 0;
    tabl.each(function(idx, el){
		var inputs = $(".table-responsive table tbody tr td a title").get();
		message.channel.send({content : inputs.text()});
	})

}