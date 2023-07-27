const pushRouter = require('express').Router()
const { default: mongoose, Model } = require('mongoose')
const tokenSchema = require("../schema/tokenSchema")
const router = require('./ping')
const admin = require('firebase-admin')
require('dotenv').config()

const tokenModel = mongoose.model('tokens', tokenSchema)
const uninstalledTokenModel = mongoose.model('uninstalled_tokens', tokenSchema)

pushRouter.get("/", (req, res) => {
    res.send("Push endpoint")
})

pushRouter.get("/tokens", async (req, res) => {
    // return the list of FCM Tokens
    let tokensData = await tokenModel.find()
    res.send({"count":tokensData.length, tokensData})
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

pushRouter.get("/uninstalled", async (req, res) => {
    let uninstalledTokenDocs = await uninstalledTokenModel.find()
    res.send({"response" : uninstalledTokenDocs})
})

pushRouter.get("/dropCollection", async (req, res) => {
    let collectionName = req.query.collection
    await mongoose.connection.db.dropCollection(collectionName).then((result) => {
        res.send(result)
    })
    // res.send(collectionName)
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

        await admin.messaging().sendMulticast(message).then(async (fcmRes) => {
            console.log("FCM send result : " + fcmRes["responses"])

            await trackUninstall(tokens, fcmRes["responses"])

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

async function trackUninstall(tokenList, fcmRes){
    let fcmListSize = fcmRes.length
    let uninstalledTokens = []

    for(let i = 0; i < fcmListSize; ++i){
        if(fcmRes[i]["success"] == false){
            uninstalledTokens.push(tokenList[i])
        }
    }

    // console.log("uninstalled tokens" + uninstalledTokens)

    let uninstallTokenCount = uninstalledTokens.length

    for(let j = 0; j < uninstallTokenCount; ++j){
        let uninstallToken = new uninstalledTokenModel({token: uninstalledTokens[j], timestamp: "", service: "FCM"})
        uninstallToken.save().then(async (res) => {
            console.log("Uninstall Token added : " + uninstalledTokens[j])
            await dropStaleToken(uninstalledTokens[j])
        }).catch(e => console.log("Error while adding uninstall token : " + uninstalledTokens[j]))
    }
}

async function dropStaleToken(token){

    console.log("token" + token)
    // await tokenModel.find({token}).then((res) => {
    //     console.log("token found " + res)
    // })

    await tokenModel.findOneAndDelete({token}).then((res) => {
        console.log("Token is deleted")
        console.log(res)
    }).catch(e => console.log("Error " + e))

    // console.log(token)
    // await tokenModel.find({token: token}).then((res) => {
    //     console.log(res)
    //     console.log("Mama Mia")
    // })

    // await tokenModel.deleteOne({token}).then((res) => {
    //     console.log(res)
    //     console.log("Token drop : ")
    // }).catch(e => console.log("Token drop failed " + e))
}

module.exports = pushRouter