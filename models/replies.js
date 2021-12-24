const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    
    serverid: {
        type: String,
        required: true,
        unique:true,
    },
    pairs: {
        type: Array,
    },
    rpairs:{
        type: Array,
    },
  });
  
  const Replies = mongoose.model("replies", UserSchema);
  
  module.exports = Replies;