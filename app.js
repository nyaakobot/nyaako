const { Client, Intents, MessageEmbed, MessageAttachment } = require('discord.js');
const { token } = require('./config.json');
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
express().listen(PORT, () => console.log(`Listening on ${ PORT }`));
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});


client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate',async function(message) {
	var i=0;
	if (message.content ==='hello')
		await message.channel.send({content: 'Hello Everynyan! How are you? Fine. Sankyu'});
	if (message.content ==='help')
		await message.channel.send({content: 'no'});
	if (message.content.startsWith('nyaa '))
	{	

		var s=message.content.substring(5);
		if(s.startsWith('-l '))
		{
			await message.channel.send({content: 'test log'+json.stringify(file.results[1])});
		}
		if(s.trim().length==0)
		{
			await message.channel.send({content: 'https://64.media.tumblr.com/eff67a0dca33bdf7d1c56150859c75ba/tumblr_mm6p2zCCxR1ra0sfio1_500.gif'});
			await message.channel.send({content: 'sup'});
		}
		else if(s.startsWith('-d '))
		{
			var s2=s.substring(s.indexOf('-d')+3);
			try{
				const file = await readFile('fetchedData.json', 'utf8');
				const scrap=JSON.parse(file);
				const downl=scrap.results[s2].dlink;
				console.log(downl);
				const torf = fs.createWriteStream(scrap.results[s2].title+".torrent");
				const request = http.get(downl, function(response) {
  				response.pipe(torf);	
				  torf.on('finish', function() {
					torf.close(cb);		
				  });
				
				});
				const att = new MessageAttachment(torf);
				message.channel.send({files: [att]});
			}
			catch(e)
			{
				await message.channel.send({content: 'Errrrrrrr'});
			}
		}
		else
		{
			var ns="";
			for(let i=0;i<s.length;i++)
			{
				if(s.charAt(i)==' ')
				{
					ns=ns+"+";
				}
				else{
					ns=ns+s.charAt(i);
				}
			}
			await scrapNyaa("https://nyaa.si/?f=0&c=0_0&q="+s,message);
			try{
				const file = await readFile('fetchedData.json', 'utf8');
				const scrap=JSON.parse(file);
				console.log(file);
				var output = new MessageEmbed().setTitle('Search Results: ').setColor('#3497ff').setFooter("Enter 'more nyaa' for more results");
				var content="";
				const results=scrap.results;
				if(results.length==0)
				await message.channel.send({content: 'No results'});
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
					await message.channel.send({embeds : [output]});
					return true;
				}
			}
			catch (e) {
				console.error(e);
			}
}
}
})


client.login(token);
async function scrapNyaa(url,message){
	const { data } = await axios.get(url);
	const $ = cheerio.load(data);
	const tabl = $(".table-responsive table tbody tr");
	const file={results: []};
		tabl.each(function(idx, el){
				const row= $(el).children("td");
				const arr=[];
				row.each(function(idx, el2){
					var temp=$(el2).html().replace(/(\r\n|\n|\r)/gm, "").replace(/(\r\t|\t|\r)/gm, "");
					if(temp.trim().length!=0){
						arr.push(temp);		
					}			
				});
				var i1=arr[1].indexOf("title=\"",arr[1].indexOf("fa fa-comments"))+7;
				var i2=arr[1].indexOf("\"",i1+2);
				const title=arr[1].substring(i1,i2);
				var i1=arr[0].indexOf("title=\"")+7;
				const dl="http://nyaa.si"+arr[2].substring(9,arr[2].indexOf("\"",11));
				const size=arr[3];
				const dateAdded=arr[4];
				const seeds=arr[5];
				const leechers=arr[6];
				const result={title: title,	dlink: dl,size: size,dateAdded: dateAdded,seeders: seeds,leechers: leechers};
				file.results.push(result);
		});
		const json = JSON.stringify(file);			
		fs.writeFile('fetchedData.json', json, 'utf8', function(err){
			if(err){ 
				console.log(err); 
			} else {
				console.log("fetch success");
			}});	
		console.log(json.length);
}