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
    create:async (message)=>{
        const { channelId ,createdTimestamp}=message;
        const userId=message.author.id;
        const params=message.content.split(' ');
        const time=createdTimestamp+parseInt(params[1])
        console.log(channelId,time,userId);
        var query=await Reminders.create({channelId,userId,time,msg:params[2]})
        console.log(query)
    }
        
}
