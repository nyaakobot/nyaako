const mongoose = require('mongoose');
const uri =process.env.MongoSecret
const Replies=require('../models/base')
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

async function add(message){
    try{
        if(message.content.includes(' -r ')==false)
        {
            message.reply("Syntax err");
            return
        }
        const mess=message.content.substring(10,message.content.indexOf('-r')-1);
        const rep=message.content.substring(message.content.indexOf('-r')+3);
        const sid=message.guild.id;
        var arr=[];
        var query=await Replies.findOne({serverid:sid})
        if(!query){
            query=await Replies.create({serverid:sid,pairs:arr})
        }
        arr=query.pairs;
        const check=arr.find(item=>{return item.mess===mess})
        if(check){
            await message.reply('custom reply message already exists for keyword "'+mess+'"')
            return;
        }
        arr.push({mess,rep});
        query=await Replies.findOneAndUpdate({serverid:sid},{pairs:arr})
        message.reply("added custom reply message for keyword \""+mess+"\"");
    }catch(e){
        console.log(e)
    }
}
async function remove(message){
    try{
        const mess=message.content.substring(13);
        console.log(mess);
        const sid=message.guild.id;
        var query=await Replies.findOne({serverid:sid})
        if(!query){
            await message.reply('custom reply message doesnt exist for keyword "'+mess+'"');
        }
        var arr=query.pairs;
        console.log(arr)
        const check=arr.find(item=>{return item.mess===mess})
        console.log(check)
        if(!check){
            await message.reply('custom reply message doesnt exist for keyword "'+mess+'"');
            return;
        }
        var narr=[]
        arr.forEach(element => {
            if(element.mess!=mess)
                narr.push(element)
        });
        query=await Replies.findOneAndUpdate({serverid:sid},{pairs:narr})
        await message.reply('custom reply message removed for keyword "'+mess+'"');
    }catch(e){
        console.log(e)
    }
}
async function addReactions(message){
    try{
        if(message.content.includes(' -r ')==false)
        {
            message.reply("Syntax err");
            return
        }
        const mess=message.content.substring(10,message.content.indexOf('-r')-1);
        const rep=message.content.substring(message.content.indexOf('-r')+3);
        const sid=message.guild.id;
        var arr=[];
        var query=await Replies.findOne({serverid:sid})
        if(!query){
            query=await Replies.create({serverid:sid})
        }
        arr=query.rpairs;
        const check=arr.find(item=>{return item.mess===mess})
        if(check){
            await message.reply('custom bot reaction already exists for keyword "'+mess+'"')
            return;
        }
        arr.push({mess,rep});
        query=await Replies.findOneAndUpdate({serverid:sid},{rpairs:arr})
        message.reply("added custom reaction for keyword \""+mess+"\"");
    }catch(e){
        console.log(e)
    }
}
async function removeReactions(message){
    try{
        const mess=message.content.substring(13);
        console.log(mess);
        const sid=message.guild.id;
        var query=await Replies.findOne({serverid:sid})
        if(!query){
            await message.reply('custom reaction doesnt exist for keyword "'+mess+'"')
        }
        var arr=query.rpairs;
        console.log(arr)
        const check=arr.find(item=>{return item.mess===mess})
        console.log(check)
        if(!check){
            await message.reply('custom reaction doesnt exist for keyword "'+mess+'"')
            return;
        }
        var narr=[]
        arr.forEach(element => {
            if(element.mess!=mess)
                narr.push(element)
        });
        query=await Replies.findOneAndUpdate({serverid:sid},{rpairs:narr})
        await message.reply('custom reaction removed for keyword "'+mess+'"');
    }catch(e){
        console.log(e)
    }
}
async function check(message){
    try{
        const sid=message.guild.id;
        const mess=message.content;
        var query=await Replies.findOne({serverid:sid})
        if(!query){
            return;
        }
        var arr=query.pairs;
        const reply=arr.find(item=>{
            if(item.mess===mess){
                console.log(item.rep)
                return item.rep
            }
            })
        if(reply)
        message.reply(reply.rep)
        arr=query.rpairs;
        const react=arr.find(item=>{
            if(item.mess===mess){
                console.log(item.rep)
                return item.rep
            }
            })
        if(react)
        message.react(react.rep);
    }catch(e){
        console.log(e)
    }
}
module.exports = {
    add,check,addReactions,remove,removeReactions
}