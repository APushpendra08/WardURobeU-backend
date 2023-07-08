const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
const FormData = require('form-data')
const fileUpload = require('express-fileupload')
require('dotenv').config()
const mongooose = require('mongoose')
const pingSchema = require('./schema/pingSchema')


const IMAGE_HOST_URL = "https://freeimage.host/api/1/upload"
const IMAGE_HOST_API_KEY = process.env.IMAGE_HOST_API_KEY
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileUpload())

app.post('/', (req, res) => {

    const {image} = req.files
    if(!image) {
        console.log("File missing")
        return res.send("File missing")
    }
    
    else {
        console.log(image)
        console.log("File found - POST")
        let buffer = image.data
        uploadImage(buffer.toString('base64'), res)
    }
})

const pingModel = mongooose.model('ping', pingSchema)

app.get('/ping', (req, res) => {
    const ts = Date.now().toString()
    const newTS = new pingModel({ timestamp: ts})

    newTS.save().then((mongoRes) => {
        console.log(mongoRes)
        res.send(mongoRes)
    })
    // console.log(ts.toString())
        // res.send({"ts":ts.toString()})
})

app.get('/history', async (req, res) => {
    const pingData = await pingModel.find()
    const history = []
    for(let index = 0; index < pingData.length; ++index){
        let pingObj = pingData[index]
        let ts = pingObj.timestamp
        let datetimeString = new Date(parseInt(ts))
        console.log(datetimeString)
        history.push({_id: pingObj._id , time: datetimeString})
    }
    console.log(pingData)
    res.send(history)
})

app.get('/', (req, res) => {

    const imageData = req.body.imageData

    if(imageData == null) {
        console.log("File missing")
        return res.send("File missing")
    } 
    else {
        console.log("File found - GET")
        uploadImage(imageData, res)
    }

    
})

function uploadImage(imageData, res){
    const form = FormData()
    form.append("key", IMAGE_HOST_API_KEY)
    form.append("source", imageData)

    console.log("Uploading file")
    axios.post(IMAGE_HOST_URL, form, { headers : form.getHeaders() })
        .then((response) => {

            const imageURL = response.data.image.image.url
            if(imageURL == null)
                imageURL = response.data.image.display_url

            if(imageURL == null){
                console.log("Upload failed")
                return res.send("Upload failed for some reason")
            }

            console.log("Upload successful")
            res.send(imageURL)
        }).catch((err) => {
            console.log(err.response)
            res.json(err.message)
        })
}

app.get('/user/signUp', (req, res) => {
    res.send("SignUp")
})

app.get('/user/signIn', (req, res) => {
    res.send("SignIn")
})

app.get('/wardrobe', (req, res) => {
    res.send("All category of wardrobe")
})

app.get('/wardrobe/:userId', (req, res) => {
    res.send("Wardrobe for user")
})

app.post('/wardrobe', (req, res) => {
    res.send("Wardrobe upload")
})


mongooose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server started at " + PORT)
        })
    }).catch( (e) => {
        console.log(e)
    })

