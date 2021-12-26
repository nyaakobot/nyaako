const fetch = require('node-fetch');
const {MessageEmbed,MessageAttachment } = require('discord.js');
async function execute(message){
    const type=message.content.split(/ +/).shift().toUpperCase().slice(1);
    console.log(type)
    const sQ=message.content.substring(7);
    var query = `
    query ($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page (page: $page, perPage: $perPage) {
        pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
        }
        media (id: $id, search: $search, type: `+type+`) {
        id
        title {
            romaji
            english
        }
        coverImage{
            large
        }
        description
        bannerImage
        format
        status
        episodes
        chapters
        meanScore
        source
        studios{
            edges{
                isMain
                node{
                    name
                }
            }
        }
        startDate{
            year
        }
        genres
        }
    }
    }
    `;

    var variables = {
        search: sQ,
        page: 1,
        perPage: 20
    };
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
        if(length==0)
        await message.reply('No results')
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
            const emb=new MessageEmbed().setTitle(results.title.romaji).setURL('https://anilist.co/'+type.toLowerCase()+'/'+results.id).setThumbnail(results.coverImage.large).setImage(results.bannerImage).setColor('#e3b811');
            if(results.status === 'FINISHED'){
                if(type==='ANIME')
                emb.setDescription(results.description.replace(/<[^>]+>/g, '')+"\n\n**Format**: "+results.format+"\n**Produced by**: "+new Intl.ListFormat().format(studios)+"\n**Source**: "+results.source+"\n**Status**: "+results.status+"\n**Episodes**: "+results.episodes+"\n**Started On**: "+results.startDate.year+"\n**Genres**: "+new Intl.ListFormat().format(results.genres)+"\n**Mean Score**: "+results.meanScore);
                else
                emb.setDescription(results.description.replace(/<[^>]+>/g, '')+"\n\n**Format**: "+results.format+"\n**Source**: "+results.source+"\n**Status**: "+results.status+"\n**Chapters**: "+results.chapters+"\n**Started On**: "+results.startDate.year+"\n**Genres**: "+new Intl.ListFormat().format(results.genres)+"\n**Mean Score**: "+results.meanScore);
            }
            else{
                if(type==='ANIME')
                emb.setDescription(results.description.replace(/<[^>]+>/g, '')+"\n\n**Format**: "+"\n**Produced by**: "+new Intl.ListFormat().format(studios)+results.format+"\n**Source**: "+results.source+"\n**Status**: "+results.status+"\n**Started On**: "+results.startDate.year+"\n**Genres**: "+new Intl.ListFormat().format(results.genres)+"\n**Mean Score**: "+results.meanScore)
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