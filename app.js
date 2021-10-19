const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { table } = require('console');
express().listen(PORT, () => console.log(`Listening on ${ PORT }`));

const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});


client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate',async function(message) {
	if (message.content ==='hello')
		await message.channel.send({content: 'Hello Everynyan! How are you? Fine. Sankyu'});
	if (message.content ==='help')
		await message.channel.send({content: 'no'});
	if (message.content === 'testEmbed')
	{
		const exampleEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Some title')
		.setURL('https://discord.js.org/')
		.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
		.setDescription('Some description here')
			.setThumbnail('https://i.imgur.com/AfFp7pu.png')
		.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here'},
		{ name: 'Inline field title', value: 'Some value here'},
		)
		.addField('Inline field title', 'Some value here', true)
		.setImage('https://i.imgur.com/AfFp7pu.png')
		.setTimestamp()
		.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
		message.channel.send({ embeds: [exampleEmbed] });
	}
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
			//scrapNyaa('./temp.html',message);				
		}

	}})


client.login(token);
async function scrapNyaa(url,message){
	const { data } = await axios.get(url);
	const $ = cheerio.load(data);
	const tabl = $(".table-responsive table tbody tr");
	var total="";
	var i=0;
    tabl.each(function(idx, el){
		const results = new MessageEmbed()
		.setColor('#0099ff')
		const row= $(el).children("td");
		const arr=[];
		row.each(async function(idx, el2){
			var temp=$(el2).html();
			if(temp.trim().length!=0){
				arr.push(temp);
				console.log("pushed")
				results.addField({name: temp});
			}
	});
	console.log(arr);
	message.channel.send({ embeds: [results] });
	i++;
	if(i==10)
		return false;
	})
}
