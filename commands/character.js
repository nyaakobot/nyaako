const fetch = require('node-fetch');
const { MessageEmbed, MessageAttachment } = require('discord.js');
async function execute(message) {
    const type = message.content.split(/ +/).shift().toUpperCase().slice(1);
    const sQ = message.content.substring(11);
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
        characters (id: $id, search: $search) {
        id
        name{
            full
        }
        image{
            large
        }
        description
        }
    }
    }
    `;

    var variables = {
        search: sQ,
        page: 1,
        perPage: 50
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
        let i = 0;
        const length = data.data.Page.characters.length;
        console.log(length);
        if (length == 0)
            message.reply("No results")
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
            const results = data.data.Page.characters[i];
            const emb = new MessageEmbed().setTitle(results.name.full.toUpperCase()).setURL('https://anilist.co/character/' + results.id).setThumbnail(results.image.large).setImage(results.image.large);
            if (results.description) emb.setDescription("\n\n" + results.description.replace(/<[^>]+>/g, '').replace(/~!/g, '||').replace(/!~/g, '||') + "\n\n\n").setColor('#e3b811');
            if (sQ === ('agni')) emb.setImage('https://i.kym-cdn.com/photos/images/newsfeed/001/867/878/32d.png')

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