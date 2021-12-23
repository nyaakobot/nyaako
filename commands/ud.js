const axios = require("axios");
const {MessageEmbed} = require('discord.js');
async function execute(message){
    const query=message.content.substring(4)
    const url=('https://api.urbandictionary.com/v0/define?term='+query)
    console.log(url)
    async function getresults(url){
        try {
          const response = await axios.get(url);
          const data = response.data;
          const mean=data.list[0].definition.replace(/\[/g, '**').replace(/\]/g, '**')+"\n\n"
          const ex=data.list[0].example.replace(/\[/g, '**').replace(/\]/g, '**');
          var output = new MessageEmbed().setTitle(query.toUpperCase()).setColor('#e3b811');
          output.setDescription(mean).addFields(
		      { name: '*Examples*', value: "\n"+ex });
          await message.reply({embeds: [output]});
        } catch (error) {
          console.log(error);
        }
    }
    await getresults(url);
}

module.exports = {
    execute,
}