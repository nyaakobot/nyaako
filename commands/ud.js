const axios = require("axios");
const { MessageEmbed } = require('discord.js');
async function execute(message) {
  const query = message.content.substring(4)
  let i = 0;
  const url = ('https://api.urbandictionary.com/v0/define?term=' + query)
  const response = await axios.get(url);
  const data = response.data;
  var length = data.list.length
  if (parseInt(length) < 1)
    message.reply("No results")
  var output = await getresults(i);
  try {
    const msg = await message.reply({ embeds: [output] })
    if (parseInt(length) == 1)
      return;
    await msg.react('◀️')
    await msg.react('▶️')
    const filter = (reaction, user) => {
      return reaction.emoji.name === '▶️' || reaction.emoji.name === '◀️' && user.id === message.author.id;
    };

    const collector = msg.createReactionCollector({ filter, time: 120000 });

    collector.on('collect', async (reaction, user) => {
      switch (reaction.emoji.name) {
        case '▶️': output = await getresults(++i); await msg.edit({ embeds: [output] }); break;
        case '◀️': output = await getresults(--i); await msg.edit({ embeds: [output] }); break;
      }
    });
  }
  catch (error) {
    console.log(error);
  }
  async function getresults(i) {
    try {
      if (i < 0)
        i = parseInt(length) + parseInt(i);
      if (i > parseInt(length) - 1)
        i = 0;
      const mean = data.list[i].definition.replace(/\[/g, '**').replace(/\]/g, '**') + "\n\n"
      const ex = data.list[i].example.replace(/\[/g, '**').replace(/\]/g, '**');
      var output = new MessageEmbed().setTitle(query.toUpperCase()).setColor('#e3b811');
      output.setDescription(mean).addFields(
        { name: '*Examples*', value: "\n" + ex });
      return output;
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = {
  execute,
}