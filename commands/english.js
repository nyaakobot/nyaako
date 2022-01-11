const fetch = require('node-fetch');
const {MessageEmbed} = require('discord.js');
async function execute(message){
    const query=message.content.substring(7)
    let i=0;  
    const url=`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`
    await fetch(url).then(handleResponse)
                    .then(handleData)
                    .catch(handleError);

    async function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }
    async function handleData(data) {
      let temp=data[0].meanings
      let res=[];
      temp.forEach(i => {
          i.definitions.forEach(j => {
              j['pos']=i.partOfSpeech
              res.push(j);
          }); 
      });
      const length=res.length;
      let i=0;
      console.log(res)
      var output=await getresults(i);
          try{
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
                    case '▶️':output=await getresults(++i);if(output) await msg.edit({embeds:[output]});break;
                    case '◀️':output=await getresults(--i);if(output) await msg.edit({embeds:[output]});break;
                  }
                });        
              }
              catch (error) {
                console.log(error);
              }
          async function getresults(i){
            try {
              if(i<0)
              i=parseInt(length)+parseInt(i);
              if(i>parseInt(length)-1)
              i=0;
              var output = new MessageEmbed().setTitle(query.toUpperCase()).setColor('#e3b811');
              output.setDescription(`*(${res[i].pos})* ${res[i].definition}`)
              if(res[i].example) output.addFields({ name: '*Example*', value: `\n${res[i].example}` });
              if(new Intl.ListFormat().format(res[i].synonyms)) output.addFields({ name: '*Synonyms*', value: `\n${new Intl.ListFormat().format(res[i].synonyms)}` });
              if(new Intl.ListFormat().format(res[i].antonyms)) output.addFields({ name: '*Antonyms*', value: `\n${new Intl.ListFormat().format(res[i].antonyms)}` });
              return output;
            }catch(error){
              console.log(error)
            }
          }
          }
    async function handleError(e){
      console.log(e)
      await message.reply("Not found")
    }
}

module.exports = {
    execute,
}