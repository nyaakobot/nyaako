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
	const results=[];
	const tabl = $(".table-responsive table tbody tr");
	var i=0;
	const output = new MessageEmbed().setTitle('Search Results: ').setColor('#3497ff').setFooter("Enter 'more nyaa' for more results");
    tabl.each(function(idx, el){
		const row= $(el).children("td");
		const arr=[];
		row.each(async function(idx, el2){
			var temp=$(el2).html().replace(/(\r\n|\n|\r)/gm, "").replace(/(\r\t|\t|\r)/gm, "");
			if(temp.trim().length!=0){
				arr.push(temp);		}
			
	});
	 //Tille
	var i1=arr[1].indexOf("title=\"",arr[1].indexOf("fa fa-comments"))+7;
	var i2=arr[1].indexOf("\"",i1+2);
	const title=arr[1].substring(i1,i2);
	var i1=arr[0].indexOf("title=\"")+7;
	const category=arr[0].substring(i1,arr[0].indexOf("\"",i1+2));
	var i1=arr[2].indexOf("\"magnet:")+1;
	const mlink=arr[2].substring(i1,arr[2].indexOf("\"",i1+2));
	const size=arr[3];
	const dateAdded=arr[4];
	const seeds=arr[5];
	const leechers=arr[6];
	const result={title: title,category: category ,mlink: mlink,size: size,dateAdded: dateAdded,seeders: seeds,leechers: leechers};
	results.push(result);
	
	});
	if(results.length==0)
		message.channel.send({content: 'No results'});
		else{
	for(let c=i;c<i+5;c++)
	{
		if(c!=results.length){
		head=results[c];

		output.addFields(
			{ name: head.title, value: 'Category : '+head.category },
			{ name: 'Size', value: head.size, inline: true },
			{ name: 'Seeders/Leechers', value: head.seeders+"/"+head.leechers, inline: true },
			{ name: 'Date Added', value: head.dateAdded, inline: true },
			{ name: 'Magnet', value: '[link]('+head.mlink+')'},
		)
		}
	}
	client.on('messageCreate', (message)=>{
	message.channel.send({embeds : [output]});
	console.log(results);
	if (message.content === 'more nyaa'){
		i=i+5;
		output = new MessageEmbed().setTitle('More Results: ').setColor('#3497ff').setFooter("Enter 'more nyaa' for more results");
		for(let c=i;c<i+5;c++)
		{
			if(c!=results.length){
			head=results[c];
			output.addFields(
			{ name: head.title, value: 'Category : '+head.category },
			{ name: 'Size', value: head.size, inline: true },
			{ name: 'Seeders/Leechers', value: head.seeders+"/"+head.leechers, inline: true },
			{ name: 'Date Added', value: head.dateAdded, inline: true },
			{ name: '[Magnet]('+head.mlink+')', value: '\u200B'},
		)
			}
		}
		if(i==results.length)
		{
			message.channel.send({content: 'No more results'});
		}
		else
		message.channel.send({embeds : [output]});

		}
		});
	}
}
