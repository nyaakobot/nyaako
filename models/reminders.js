const mongoose = require('mongoose');
const ReminderSchema = new mongoose.Schema({
    channelId: {
        type: String,
        required: true,
    },
    userId:{
        type: String,
        required: true,
    },
    time:{
        type: Number,
        required: true,
    },
    msg:{
        type:String,
    }
});

const Reminders = mongoose.model("reminders", ReminderSchema);

module.exports = Reminders;