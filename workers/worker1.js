const mongoose = require('mongoose');
const uri = process.env.MongoSecret
const Reminders = require('../models/reminders')
const { check } = require('../commands/reminders.js')
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
process.on('message', async ({ message })=> {
    try {
        console.log("worker1 up and running")
        setInterval(async () => {
            const currentTime = (new Date()).getTime()
            var queries = await Reminders.find({ time: { $lte: currentTime } })
            if (queries.length <= 0) return;
            await process.send(queries)
            var query2 = await Reminders.deleteMany({ time: { $lte: currentTime } })
        }, '10000')
    }
    catch (e) {
        console.log(e)
    }
});
