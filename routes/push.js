const pushRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const tokenSchema = require("../schema/tokenSchema")
const router = require('./ping')
const admin = require('firebase-admin')
require('dotenv').config()

const tokenModel = mongoose.model('tokens', tokenSchema)

// admin.initializeApp({
//     credential: admin.credential.cert(JSON.parse(process.env.SERVICE_KEY))
// })


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

pushRouter.get("/sendMessage", async (req, res) => {

    let title = req.query.title
    let pushMessage = req.query.message

    await sendPushMessage(title, pushMessage, res)
})

pushRouter.post("/sendMessage", async (req, res) => {

    let title = req.body.title
    let pushMessage = req.body.message

    await sendPushMessage(title, pushMessage, res)
})

async function sendPushMessage(title, pushMessage, res){
    await tokenModel.find().then( async (result) =>  {
        console.log(result)
        
        let tokens = []
        for(let i = 0; i < result.length; ++i){
            let token = result[i].token
            if(token != null)
            tokens.push(token)
        }

        console.log(tokens)

        let message = {
            data: {
                "title":title.toString(),
                "message":pushMessage.toString()
            },
            tokens: tokens
        }

        await admin.messaging().sendMulticast(message).then((fcmRes) => {
            console.log("FCM send result : " + fcmRes)
            res.send(fcmRes)
        }).catch((e) => {
            console.log("FCM send error : " + e)
            res.send(e)
        })
    }).catch((e) => {
        console.log("Error in Mongo fetch " + e)
        res.send(e)
    })
}

module.exports = pushRouter