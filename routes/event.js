const eventRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const eventSchema = require("../schema/eventSchema")

const eventModel = mongoose.model('events', eventSchema)


eventRouter.post("/trackEvent", async (req, res) => {
    
    let body = req.body
    let eventName = body["EVENT_NAME"]
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

module.exports = eventRouter