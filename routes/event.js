const eventRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const eventSchema = require("../schema/eventSchema")

const eventModel = mongoose.model('events', eventSchema)

eventRouter.post("/trackEventBatch", async (req, res) => {
    let body = req.body
    let batch = body["eventListData"]
    if(batch == null){
        body = body["nameValuePairs"]
    }

    batch = body["eventListData"]["values"]
    arraydata = []

    for(let i = 0; i < batch.length; ++i){
        let data = batch[i]["nameValuePairs"]
        console.log(data)
        arraydata.push(data)
    }

    let newEvent = new eventModel(arraydata)

    eventModel.collection.insertMany(arraydata, (err, doc) => {
        if(err)
            res.send(err)
        else
            res.send(doc)
    })
})

eventRouter.post("/trackEvent", async (req, res) => {
    
    let body = req.body
    console.log(req.body)
    let eventName = body["EVENT_NAME"]

    if(eventName == null){
        body = body["nameValuePairs"]
    }
    eventName = body["EVENT_NAME"]
    let eventAttrib = body["EVENT_ATTRIBUTES"]

    console.log(eventName , eventAttrib)
    
    let newEvent = new eventModel({
        name: eventName,
        attributes: eventAttrib
    })

    newEvent.save().then((dbRes) => {
        console.log("DB Result " + dbRes)
        res.send(dbRes)
    }).catch(e => {
        console.log("Error"  + e)
        res.send(e)
    })
})

async function saveEventInDB(eventName, eventAttrib){

}

module.exports = eventRouter