const mongoose = require('mongoose');
const GameDB = require('../models/gamedb')
const axios = require('axios')
const uri = process.env.MongoSecret
mongoose.connect(uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
process.on('message', async ({ message }) => {
    const AppList = await axios.get('http://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json').then(async (res) => await res.data.applist.apps)
    console.log("GameDB Updater running")
    const recent = await GameDB.find({}).sort({ _id: -1 }).limit(1);
    let index = 2800
    console.log('INDEX STARTING FROM ', index)
    const Q = AppList.slice(index);
    const l = AppList.length
    setInterval(async () => {
        console.log(index)
        let el=AppList[index++];
        let url = `https://store.steampowered.com/api/appdetails?appids=${el.appid}`
        let data = await axios.get(url).then(async (res) => await res.data).catch(e => { console.error('ERRRR') })
        if (data) {
            let temp = Object.values(data)[0]
            if (temp.success == true && temp.data.type === 'game') {
                await GameDB.create({ appid: el.appid, name: el.name }).then(() => console.log(el)).catch(e => console.log("mongo err"))
            }
        }
    }, '1500');
});
async function task(el) {
    setTimeout(() => {
    }, '2000');
    console.log('ehllo')

}
