const axios=require('axios')
const cheerio=require('cheerio')
const {MessageEmbed} = require('discord.js');
async function getMeanings(query){
    const url="https://jisho.org/search/"+query;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    var tags=null;
    const meanings=$('.exact_block').find('div[class="meanings-wrapper"]').contents().map(function(){        
        if($(this).html()){
            if($(this).attr('class')===("meaning-tags")){
                tags=$(this).text();
            }
            if($(this).attr('class')===("meaning-wrapper")){
                const meaning=$(this).find('span.meaning-meaning').text();
                return ({tags,meaning})                
            }
        }
    }).get();
    return meanings;    
}
async function execute(message){
    try{
        const query=message.content.substring(8);
        const results=await getMeanings(query)
        const length=results.length;
        var output = new MessageEmbed().setTitle(query.toUpperCase()).setColor('#e3b811');
        let i=0;
        if(parseInt(length)<1){
            await message.reply("No results")
            return
        }
        await buildEmbed();    
        const msg=await message.reply({embeds: [output]})
          if(parseInt(length)==1)
          return;
            await msg.react('◀️')
            await msg.react('▶️')     
          const filter = (reaction, user) => {
            return reaction.emoji.name === '▶️'||reaction.emoji.name === '◀️' && user.id === message.author.id;
          };
          
          const collector = msg.createReactionCollector({ filter, time: 120000 });
          
          collector.on('collect', async (reaction, user) => {
            switch(reaction.emoji.name){
              case '▶️':++i;await buildEmbed();await msg.edit({embeds:[output]});break;
              case '◀️':--i;await buildEmbed();await msg.edit({embeds:[output]});break;
            }
          });
          async function buildEmbed(){
            try {
                if(i<0)
                i=parseInt(length)+parseInt(i);
                if(i>parseInt(length)-1)
                i=0;
                output = new MessageEmbed().setTitle(query.toUpperCase()).setColor('#e3b811');
                console.log(results[i])
                output.setDescription('> '+results[i].meaning+"\n" );
              }catch(error){
                console.log(error)
              }
        }        
        }
        catch (error) {
          console.log(error);
        }    
}
module.exports={
    execute
}
