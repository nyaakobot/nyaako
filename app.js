const { Client, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { table } = require('console');
const http = require('http'); // or 'https' for https:// URLs
const { getServers } = require('dns');
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
	if (message.content.startsWith('nyaa'))
	{	
		
		var s=message.content.substring(5);
		if(s.trim().length==0)
		{
			await message.channel.send({content: 'https://64.media.tumblr.com/eff67a0dca33bdf7d1c56150859c75ba/tumblr_mm6p2zCCxR1ra0sfio1_500.gif'});
			await message.channel.send({content: 'sup'});
		}
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
			var results=[];
			async function getResults(){
			results=await scrapNyaa("https://nyaa.si/?f=0&c=0_0&q="+s,message);
			}
			getResults();
			console.log(results);
			var output = new MessageEmbed().setTitle('Search Results: ').setColor('#3497ff').setFooter("Enter 'more nyaa' for more results");
			var content="";
			if(results.length==0)
			message.channel.send({content: 'No results'});
			else{
				for(let c=i+1;c<i+16;c++)
				{	
					if(results.length>=c){
					head=results[c-1];
					content=content+"**"+c+". "+head.title+"**\n"+"*Seeds:* "+head.seeders+"\t*Leeches:* "+head.leechers+"\t*Size:* "+head.size+"\n\n";
					}
					else
					break;
				}
			output.setDescription(content);
			message.channel.send({embeds : [output]});			
			}

	}}})


client.login(token);
async function scrapNyaa(url,message){
	const { data } = await axios.get(url);
	const $ = cheerio.load(data);
	var results=[];
	const tabl = $(".table-responsive table tbody tr");
	
	tabl.each(async function(idx, el){
			const row= $(el).children("td");
			const arr=[];
			row.each(function(idx, el2){
				var temp=$(el2).html().replace(/(\r\n|\n|\r)/gm, "").replace(/(\r\t|\t|\r)/gm, "");
				if(temp.trim().length!=0){
					arr.push(temp);		}
				
			});
			var i1=arr[1].indexOf("title=\"",arr[1].indexOf("fa fa-comments"))+7;
			var i2=arr[1].indexOf("\"",i1+2);
			const title=arr[1].substring(i1,i2);
			var i1=arr[0].indexOf("title=\"")+7;
			//console.log(arr[2]);
			const size=arr[3];
			const dateAdded=arr[4];
			const seeds=arr[5];
			const leechers=arr[6];
			const result={title: title,size: size,dateAdded: dateAdded,seeders: seeds,leechers: leechers};
			results.push(result);
	});

	return results.map();
}