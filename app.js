const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()


const IMAGE_HOST_URL = "https://freeimage.host/api/1/upload"
const IMAGE_HOST_API_KEY = process.env.IMAGE_HOST_API_KEY

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {

    const imageData = req.body.imageData

    if(imageData == null)
        return res.send("empty error data")


    const form = FormData()
    form.append("key", IMAGE_HOST_API_KEY)
    form.append("source", imageData)


    axios.post(IMAGE_HOST_URL, form, { headers : form.getHeaders() })
        .then((response) => {

            const imageURL = response.data.image.image.url
            if(imageURL == null)
                imageURL = response.data.image.display_url

            if(imageURL == null)
                return res.send("Upload failed for some reason")

            res.send(imageURL)
        }).catch((err) => {
            console.log(err.response)
            res.json(err.message)
        })
})

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

app.listen(3000, () => {
    console.log("Server started at 3000")
})