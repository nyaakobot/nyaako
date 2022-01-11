const fetch = require('node-fetch');
const {MessageEmbed,MessageAttachment } = require('discord.js');
async function execute(message){
    const type=message.content.split(/ +/).shift().toUpperCase().slice(1);
    console.log(type)
    var tags=null
    var genres=null;
    var sort=null;
    if(message.content.includes('-s'))
        sort="SCORE_DESC";
    if(message.content.includes('-p'))
        sort="POPULARITY_DESC";
    if(message.content.includes('-t')){
        var temp=message.content.substring(message.content.indexOf('-t')+3);
        tags=temp.split(',')
        if(temp.includes('-'))
        tags=temp.substring(0,temp.indexOf('-')).split(',')
    }
    if(message.content.includes('-g')){
        var temp=message.content.substring(message.content.indexOf('-g')+3);
        genres=temp.split(',')
        if(temp.includes('-'))
        genres=temp.substring(0,temp.indexOf('-')).split(',')
    }
        
    var search=message.content.substring(7);
    if(tags||genres||sort)
    search=message.content.substring(7,message.content.indexOf('-')).trim();;
    if(search.length===0)
    search=null;
    var page=1
    var query = `
    query($page:Int = 1 $id:Int $type:MediaType $search:String $format:[MediaFormat]$status:MediaStatus $source:MediaSource $genres:[String]$excludedGenres:[String]$tags:[String]$excludedTags:[String] $sort:[MediaSort]=[POPULARITY_DESC,SCORE_DESC]){Page(page:$page,perPage:50){pageInfo{total perPage currentPage lastPage hasNextPage}media(id:$id type:$type format_in:$format status:$status source:$source search:$search genre_in:$genres genre_not_in:$excludedGenres tag_in:$tags tag_not_in:$excludedTags sort:$sort){id title{romaji}coverImage{extraLarge color}startDate{year month day}endDate{year month day}bannerImage season description type format status(version:2)episodes duration chapters volumes meanScore source genres isAdult averageScore popularity nextAiringEpisode{airingAt timeUntilAiring episode}studios(isMain:true){edges{isMain node{id name}}}}}}
    `;
    variables={search,page,type,tags,sort,genres}
    console.log(variables)
    // Here we define our query as a multi-line string
    // Storing it in a separate .graphql/.gql file is also possible


    // Define the config we'll need for our Api request
    var url = 'https://graphql.anilist.co',
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

    // Make the HTTP Api request
    await fetch(url, options).then(handleResponse)
                    .then(handleData)
                    .catch(handleError);

    async function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    async function handleData(data) {
        let i=0;
        const length=data.data.Page.media.length;
        if(length==0){
        await message.reply('No results')
        return;
        }
        const emb=await getresults(i);
        const msg=await message.channel.send({embeds: [emb]});
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
              case '▶️':output=await getresults(++i);await msg.edit({embeds:[output]});break;
              case '◀️':output=await getresults(--i);await msg.edit({embeds:[output]});break;
            }
          });
        async function getresults(i){  
            if(i<0)
            i=parseInt(length)+parseInt(i);
            if(i>parseInt(length)-1)
            i=0;
            const results = data.data.Page.media[i];
            const studios=[]
            results.studios.edges.forEach(element => {
                if(element.isMain==true)
                studios.push("**"+element.node.name+"**")
                else
                studios.push(element.node.name)
            });
            const emb=new MessageEmbed().setTitle(results.title.romaji).setURL('https://anilist.co/'+type.toLowerCase()+'/'+results.id).setThumbnail(results.coverImage.extraLarge).setImage(results.bannerImage).setColor(results.coverImage.color);
            if(!results.description){
                results.description="No description."
            }
            if(results.status === 'FINISHED'){
                if(type==='ANIME')
                emb.setDescription(results.description.replace(/<[^>]+>/g, '')+"\n\n**Format**: "+results.format+"\n**Produced by**: "+new Intl.ListFormat().format(studios)+"\n**Source**: "+results.source+"\n**Status**: "+results.status+"\n**Episodes**: "+results.episodes+"\n**Duration**: "+results.duration+" mins"+"\n**Started On**: "+results.startDate.year+"\n**Genres**: "+new Intl.ListFormat().format(results.genres)+"\n**Mean Score**: "+results.meanScore);
                else
                emb.setDescription(results.description.replace(/<[^>]+>/g, '')+"\n\n**Format**: "+results.format+"\n**Source**: "+results.source+"\n**Status**: "+results.status+"\n**Chapters**: "+results.chapters+"\n**Started On**: "+results.startDate.year+"\n**Genres**: "+new Intl.ListFormat().format(results.genres)+"\n**Mean Score**: "+results.meanScore);
            }
            else{
                if(type==='ANIME')
                emb.setDescription(results.description.replace(/<[^>]+>/g, '')+"\n\n**Format**: "+results.format+"\n**Duration**: "+results.duration+" mins"+"\n**Produced by**: "+new Intl.ListFormat().format(studios)+"\n**Source**: "+results.source+"\n**Status**: "+results.status+"\n**Started On**: "+results.startDate.year+"\n**Genres**: "+new Intl.ListFormat().format(results.genres)+"\n**Mean Score**: "+results.meanScore)
            else
                emb.setDescription(results.description.replace(/<[^>]+>/g, '')+"\n\n**Format**: "+results.format+"\n**Source**: "+results.source+"\n**Status**: "+results.status+"\n**Started On**: "+results.startDate.year+"\n**Genres**: "+new Intl.ListFormat().format(results.genres)+"\n**Mean Score**: "+results.meanScore);
            }
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