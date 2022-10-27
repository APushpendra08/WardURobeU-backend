const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
require('dotenv').config()
const {uploadImage} = require('./utils/FileManager')
const userRouter = require('./routes/user')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileUpload())
app.use('/u', userRouter)

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

app.listen(PORT, () => {
    console.log("Server started at " + PORT)
})