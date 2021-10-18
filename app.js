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
var nyaaresults="No Results";

const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });


client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate',async function(message) {
	if (message.content ==='hello')
		await message.channel.send({content: 'Hello Everynyan! How are you? Fine. Sankyu'});
	if (message.content ==='help')
		await message.channel.send({content: 'no'});
	if (message.content.startsWith('nyaa'))
	{	
		var s=message.content.substring(5);
		if(s.trim().length==0)
			await message.channel.send({content: 'no search parameters entered'});
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
			scrapNyaa("https://nyaa.si/?f=0&c=0_0&q="+s,message);
			
		}

	}})


client.login(token);
async function scrapNyaa(url,message){
	const { data } = await axios.get(url);
	const $ = cheerio.load(data);
	const tabl = $(".table-responsive table tbody tr");
	var results=[];
    tabl.each(function(idx, el){
		const row= $(el).children("td");
		row.each(async function(idx, el2){
			//var temp=$(el2).children("a").text();
			var temp=$(el2).children("a").text();
			if(temp.trim().length!=0)
			{
			console.log(temp);
			try{
			await message.channel({content: temp});
			}catch(err){
				await message.channel({content: 'e'});
			}
			results.push(temp);
			}
	});
	})
	return results;
}
