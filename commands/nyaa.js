const path = require('path');
const fetch=require('node-fetch')
const { MessageEmbed, MessageAttachment} = require('discord.js');
async function ping(message) {
    await message.reply({content: 'nyaan'})
}

async function getResults(query,sortBy,order){
	try{
        var results=null
        await fetch('https://nscrap.herokuapp.com/api/results',{ 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,sortBy,order
            })
        }).then(handleResponse)
        .then(handleData)
        .catch(handleError);
        async function handleResponse(response) {
        return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
        });
        }
        async function handleData(data) {
            results=data;   
        }
        console.log(results.length);
        return results;
    }catch(e){console.error(e)
    }
}
async function sendEmbed(data,i){
    try{
		const results=data;
		if(results.length==0)
		await message.channel.send({content: 'No results'});	
        else{
            var output = new MessageEmbed().setTitle('Search Results: ').setFooter("';more' for more results");
		    var content="";
			for(let c=parseInt(i)+1;c<parseInt(i)+11;c++)
			{	
				if(results.length>=c){
				head=results[c-1];
				content=content+"**"+c+". "+head.title+"**\n"+"*Seeds:* "+head.seeders+"\t*Leeches:* "+head.leechers+"\t*Size:* "+head.size+"\t*Date:* "+head.dateAdded+"\n\n";
				}
				else
				break;
			}
			output.setDescription(content).setColor('#e3b811');
			await message.channel.send({embeds : [output]});
		}}
	catch (e) {
		console.log(e);
		await message.channel.send({content: e});
	}
}

async function getInfo(url,message)
{
    try{
	const { data } = await axios.get(url);
	const $ = cheerio.load(data);
	const html = $('#torrent-description').html();
	const text = convert(html);
	var output = new MessageEmbed().setTitle('Description').setColor('#e3b811');
	output.setDescription(text);
	await message.channel.send({embeds : [output]});
    }
    catch (e) {
		console.log(e);
		await message.channel.send({content: e});
	}
}

async function execute(message){
    try{
    var msg=message.content.substring(1);
    if (msg ==='more'){
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
        var s2=msg.substring(msg.indexOf('d')+2);
        const file = await readFile('fetchedData.json', 'utf8');
        const scrap=JSON.parse(file);
        const downl=scrap.results[parseInt(s2)-1].dlink;
        await message.channel.send({files: [downl]});
    }
    else if (msg.startsWith('nyaa '))
    {	
        var query=msg.substring(5);
        const data=await getResults(query);
        await sendEmbed(data,0);
    }
    else
    return true;
}
catch(e)
{
    console.log(e);
    await message.channel.send({content: 'Err'});
}
}

module.exports = {
    execute,ping
}
