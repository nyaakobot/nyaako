const path = require('path');
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const util = require('util');
const { convert } = require('html-to-text');
const readFile = util.promisify(fs.readFile);
const { Client, Intents, MessageEmbed, MessageAttachment, Collection } = require('discord.js');
async function ping(message) {
    await message.reply({content: 'nyaan'})
}

async function getResults(message){
	try{

		const file = await readFile('fetchedData.json', 'utf8');
		const scrap=JSON.parse(file);
		var output = new MessageEmbed().setTitle('Search Results: ').setFooter("';more' for more results");
		var content="";
		const results=scrap.results;
		if(results.length==0)
		await message.channel.send({content: 'No results'});
		else{
			for(let c=parseInt(scrap.counter)+1;c<parseInt(scrap.counter)+11;c++)
			{	
				if(results.length>=c){
				head=results[c-1];
				content=content+"**"+c+". "+head.title+"**\n"+"*Seeds:* "+head.seeders+"\t*Leeches:* "+head.leechers+"\t*Size:* "+head.size+"\t*Date:* "+head.dateAdded+"\n\n";
				}
				else
				break;
			}
			output.setDescription(content);
			await message.channel.send({embeds : [output]});
		}
		scrap.counter=parseInt(scrap.counter)+10;
		console.log(scrap.counter);
		const json = JSON.stringify(scrap);			
		fs.writeFile('fetchedData.json', json, 'utf8', function(err){
		if(err){ 
		console.log(err); 
		} else {
		console.log("fetch success");
		}});	
	}
	catch (e) {
		console.log(e);
		await message.channel.send({content: 'Err'});
	}
}

async function getInfo(url,message)
{
	const { data } = await axios.get(url);
	const $ = cheerio.load(data);
	const html = $('#torrent-description').html();
	const text = convert(html);
	console.log(text);
	var output = new MessageEmbed().setTitle('Description');
	output.setDescription(text);
	await message.channel.send({embeds : [output]});
}

async function scrapNyaa(url){
	const { data } = await axios.get(url);
	const $ = cheerio.load(data);
	const tabl = $(".table-responsive table tbody tr");
	const file={results: [],counter: 0};
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
				const ml=arr[2].substring(arr[2].indexOf("magnet:"),arr[2].indexOf("\"",arr[2].indexOf("magnet:")+11));
				const size=arr[3];
				const dateAdded=arr[4];
				const seeds=arr[5];
				const leechers=arr[6];
				const result={title: title,	dlink: dl,mlink: ml,size: size,dateAdded: dateAdded,seeders: seeds,leechers: leechers};
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
async function execute(message){
    try{
    var msg=message.content.substring(1);
    if (msg.endsWith('-d'))
    {
	    
        const file = new MessageAttachment('fetchedData.json')
        await message.channel.send({content: [file]});
    }
    else if (msg.includes('yo mom'))
    {
        await message.channel.send({content : 'https://imgur.com/3HbEeOA'});
    }
    else if (msg ==='help')
        await message.channel.send({content: 'no'});
    else if (msg ==='more'){
        await getResults(message);	
    }
    else if(msg.startsWith('m '))
    {
        var s2=msg.substring(msg.indexOf('m')+2);
        const file = await readFile('fetchedData.json', 'utf8');
        const scrap=JSON.parse(file);
        const templ=scrap.results[parseInt(s2)-1].mlink;
        await message.channel.send({content: templ});
    }
    else if(msg.startsWith('i '))
    {
        var s2=msg.substring(msg.indexOf('i')+2);
        const file = await readFile('fetchedData.json', 'utf8');
        const scrap=JSON.parse(file);
        const templ=scrap.results[parseInt(s2)-1].dlink;
        const link="https://nyaa.si/view/"+templ.substring(templ.indexOf("download")+9,templ.indexOf(".torrent"));
        await getInfo(link,message);
    }
    else if (msg.startsWith('nyaa ')&&(msg.endsWith(' -p')||msg.endsWith(' -p!')))
    {	
        if(msg.endsWith(' -p'))
            var s=msg.substring(5,msg.length-3);
        else
            var s=msg.substring(5,msg.length-4);
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
        if(msg.endsWith(' -p')){
            await scrapNyaa("https://nyaa.si/?f=0&c=0_0&q="+ns+"&s=seeders&o=desc",message);
        }
        else{
            await scrapNyaa("https://nyaa.si/?f=0&c=0_0&q="+ns+"&s=seeders&o=asc",message);
        }
        await getResults(message);
    }
    else if (msg.startsWith('nyaa ')&&(msg.endsWith(' -s')||msg.endsWith(' -s!')))
    {	
        if(msg.endsWith(' -s'))
            var s=msg.substring(5,msg.length-3);
        else
            var s=msg.substring(5,msg.length-4);
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
        if(msg.endsWith(' -s')){
            await scrapNyaa("https://nyaa.si/?f=0&c=0_0&q="+ns+"&s=size&o=desc",message);
        }
        else{
            await scrapNyaa("https://nyaa.si/?f=0&c=0_0&q="+ns+"&s=size&o=asc",message);
        }
        await getResults(message);	
    }
    else if(msg.startsWith('d '))
    {
        var s2=msg.substring(message.indexOf('d')+2);
        const file = await readFile('fetchedData.json', 'utf8');
        const scrap=JSON.parse(file);
        const downl=scrap.results[parseInt(s2)-1].dlink;
        await message.channel.send({files: [downl]});
    }
    else if (msg.startsWith('nyaa '))
    {	
        var s=msg.substring(5);
        
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
        await scrapNyaa("https://nyaa.si/?f=0&c=0_0&q="+ns,message);
        await getResults(message);
        
    }
    else{
    return true;
    }
}
catch(e)
{
    console.log(e);
    await message.channel.send({content: 'Err'});
}
}

module.exports = {
    execute,
}
