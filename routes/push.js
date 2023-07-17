const pushRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const tokenSchema = require("../schema/tokenSchema")

const tokenModel = mongoose.model('tokens', tokenSchema)


pushRouter.get("/", (req, res) => {
    res.send("Push endpoint")
})

pushRouter.get("/tokens", async (req, res) => {
    // return the list of FCM Tokens
    let tokensData = await tokenModel.find()
    res.send(tokensData)
})

pushRouter.post("/addToken", (req, res) => {
    let body = req.body
    console.log(body)
    let token = body.token
    let service = body.service
    console.log(token, service)
    if(token == null)
        return res.send({"status": "418", "message": "token is null or empty"})
    if(service == null)
        return res.send({"status": "418", "message": "service is null or empty"})

    const ts = Date.now().toString()
    let newToken = new tokenModel({token: token, timestamp: ts, service: service})
    newToken.save().then((tokenAddRes) => {
        console.log(tokenAddRes)
        res.send(tokenAddRes)
    }).catch(e => res.send(e))
})

module.exports = pushRouter