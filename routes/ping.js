const router = require('express').Router()
const pingSchema = require("../schema/pingSchema")
const mongooose = require('mongoose')

const pingModel = mongooose.model('ping', pingSchema)

router.get('/ping', (req, res) => {
    const ts = Date.now().toString()
    let platform = req.query.platform
    if(platform == null)
        platform = "website"
    console.log(platform)
    const newTS = new pingModel({ timestamp: ts, platform: platform})

    newTS.save().then((mongoRes) => {
        console.log(mongoRes)
        res.send(mongoRes)
    })
})

router.get('/history', async (req, res) => {
    const pingData = await pingModel.find()
    const history = []
    for(let index = 0; index < pingData.length; ++index){
        let pingObj = pingData[index]
        let ts = pingObj.timestamp
        let datetimeString = new Date(parseInt(ts))
        console.log(datetimeString)
        history.push({_id: pingObj._id , time: datetimeString, platform: pingObj.platform})
    }
    console.log(pingData)
    res.send({"data": history})
})

module.exports = router