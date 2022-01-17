const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
async function execute(message) {
    const type = message.content.split(/ +/).shift().toUpperCase().slice(1);
    console.log(type)
    let tags = null
    let genres = null;
    let sort = null;
    if (message.content.includes('-s'))
        sort = "SCORE_DESC";
    if (message.content.includes('-p'))
        sort = "POPULARITY_DESC";
    if (message.content.includes('-t')) {
        let temp = message.content.substring(message.content.indexOf('-t') + 3);
        tags = temp.split(',')
        if (temp.includes('-'))
            tags = temp.substring(0, temp.indexOf('-')).split(',')
    }
    if (message.content.includes('-g')) {
        let temp = message.content.substring(message.content.indexOf('-g') + 3);
        genres = temp.split(',')
        if (temp.includes('-'))
            genres = temp.substring(0, temp.indexOf('-')).split(',')
    }

    let search = message.content.substring(7);
    if (tags || genres || sort)
        search = message.content.substring(7, message.content.indexOf('-')).trim();;
    if (search.length === 0)
        search = null;
    let page = 1
    let query = `
    query($page:Int = 1 $id:Int $type:MediaType $search:String $format:[MediaFormat]$status:MediaStatus $source:MediaSource $genres:[String]$excludedGenres:[String]$tags:[String]$excludedTags:[String] $sort:[MediaSort]=[POPULARITY_DESC,SCORE_DESC]){Page(page:$page,perPage:50){pageInfo{total perPage currentPage lastPage hasNextPage}media(id:$id type:$type format_in:$format status:$status source:$source search:$search genre_in:$genres genre_not_in:$excludedGenres tag_in:$tags tag_not_in:$excludedTags sort:$sort){id title{romaji}coverImage{extraLarge color}startDate{year month day}endDate{year month day}bannerImage season description type format status(version:2)episodes duration chapters volumes meanScore source genres isAdult averageScore popularity nextAiringEpisode{airingAt timeUntilAiring episode}studios(isMain:true){edges{isMain node{id name}}}}}}
    `;
    variables = { search, page, type, tags, sort, genres }
    console.log(variables)
    let url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    await fetch(url, options).then(handleResponse)
        .then(handleData)
        .catch(handleError);

    async function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    async function handleData(data) {
        let i = 0;
        const length = data.data.Page.media.length;
        if (length == 0) {
            await message.reply('No results')
            return;
        }
        const emb = await getresults(i);
        const msg = await message.channel.send({ embeds: [emb] });
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
        async function getresults(i) {
            if (i < 0)
                i = parseInt(length) + parseInt(i);
            if (i > parseInt(length) - 1)
                i = 0;
            const results = data.data.Page.media[i];
            const studiosList = []
            results.studios.edges.forEach(element => {
                if (element.isMain == true)
                    studiosList.push(`**${element.node.name}**`)
                else
                    studiosList.push(element.node.name)
            });
            const emb = new MessageEmbed().setTitle(results.title.romaji).setURL(`https://anilist.co/${type.toLowerCase()}/${results.id}`).setThumbnail(results.coverImage.extraLarge).setImage(results.bannerImage).setColor(results.coverImage.color);
            const embDescribe = ({ description, format, source, status, episodes, chapters, duration, startDate, genres, meanScore }) => {
                emb.setDescription(`${(!description || description.length >= 3000) ? `` : `${description.replace(/<[^>]+>/g, '')}\n\n`}${(format) ? `**Format**: ${format}\n` : ``}${(source) ? `**Source**: ${source}\n` : ``}${(studiosList.length != 0) ? `**Studios**: ${new Intl.ListFormat().format(studiosList)}\n` : ``}${(status) ? `**Status**: ${status}\n` : ``}${(episodes) ? `**Episodes**: ${episodes}\n` : ``}${(chapters) ? `**Chapters**: ${chapters}\n` : ``}${(duration) ? `**Duration**: ${duration} mins\n` : ``}${(startDate.year) ? `**Year of Release**: ${startDate.year}\n` : ``}${(genres) ? `**Genres**: ${new Intl.ListFormat().format(genres)}\n` : ``}${(meanScore) ? `**Mean Score**: ${meanScore}\n` : ``}`)
            };
            embDescribe(results);
            return emb;
        }
    }
    async function handleError(error) {
        console.error(error);
    }
}
module.exports = {
    execute,
}