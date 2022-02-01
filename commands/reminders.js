const mongoose = require('mongoose');
const uri = process.env.MongoSecret
const Reminders = require('../models/reminders')
mongoose.connect(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected to Mongo");
});
module.exports={
    check:async (client)=>{
        const currentTime=(new Date()).getTime()
        var queries=await Reminders.find({time:{$lte:currentTime}})
        if(queries.length<=0)return;
        for(const i of queries)
            await client.channels.fetch(i.channelId).then(channel => channel.send(`<@${i.userId}> ${i.msg}`))
        var query2=await Reminders.remove({time:{$lte:currentTime}})
    },

    create:async (message)=>{
        const { channelId ,createdTimestamp}=message;
        const userId=message.author.id;
        const params=message.content.split(' ');
        const msg=params[2];
        if(params[1]==="in"){}
        const time=createdTimestamp+parseInt(params[1])
        console.log(channelId,time,userId);
        var query=await Reminders.create({channelId,userId,time,msg})
        console.log(query)
    }
        
}
