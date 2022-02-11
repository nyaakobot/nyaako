const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    appid: {
        type: String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true,
    }
});
const  GameDB= mongoose.model("gdbsteam", Schema);
module.exports = GameDB;