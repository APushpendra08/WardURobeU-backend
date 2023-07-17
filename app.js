const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
const FormData = require('form-data')
const fileUpload = require('express-fileupload')
const mongooose = require('mongoose')
const pingRouter = require("./routes/ping")
const wardrobeRouter = require("./routes/wardrobe")
const pushRouter = require('./routes/push')

require('dotenv').config()

const IMAGE_HOST_URL = process.env.IMAGE_HOST_URL
const IMAGE_HOST_API_KEY = process.env.IMAGE_HOST_API_KEY
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(pingRouter)
app.use(wardrobeRouter)
app.use("/push", pushRouter)

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


mongooose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server started at " + PORT)
        })
    }).catch( (e) => {
        console.log(e)
    })

