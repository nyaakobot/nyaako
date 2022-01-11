const {MessageEmbed}=require('discord.js');
const mess= "**CUSTOM MESSAGES/REACTIONS**\n\
`;addreply <Keywords> -r <ReplyMessage>`\tadd custom bot reply.\n\
`;deletereply <Keywords>`\tdelete custom bot reply.\n\
`;addreact <Keywords> -r <:emote>`\tadd custom bot reaction.(emotes seperated by commas for multiple reactions)\n\
`;deletereact <Keywords>`\tdelete custom bot reaction.\n\
\n\
 **ANILIST**\n\
`;anime <SearchQuery>`\tfind anime from Anilist.\n\
`;manga <SearchQuery>`\tfind manga from Anilist.\n\
*Parameters (to be used after search query)*\n\
`-g <genre1,genre2,...>`\tfilter results by genres.\n\
`-t <tag1,tag2,...>`\tfilter results by tags.\n\
`-p`\tsort results by popularity.(default)\n\
`-s`\tsort results by score.\n\
\n\
**DICTIONARY**\n\
`;whats <SearchQuery>`\tfind english word meanings.\n\
`;romaji <SearchQuery>`\tfind romaji word meanings.\n\
`;ud <SearchQuery>`\tfind definitions from Urban Dictionary.\n\
\n\
**NYAA.SI**\n\
`;nyaa <SearchQuery>`\tfind torrents from nyaa.si.\n\
*Parameters (to be used before search query)\n\
`-s`\tsort results by Size (Descending).\n\
`-s!`\tsort results by Size (Ascending).\n\
`-p`\tsort results by Seeders (Descending).\n\
`-p!`\tsort results by Seeders (Ascending).\n\
*Options*\n\
`;i <no.>`\tview description.\n\
`;c <no.>`\tview comments.\n\
`;m <no.>`\tget magnet link.\n\
`;d <no.>`\tdownload."
async function execute(message){
    var output = new MessageEmbed().setDescription(mess).setColor('#e3b811');
    await message.channel.send({embeds:[output]});
}
module.exports={
    execute
}