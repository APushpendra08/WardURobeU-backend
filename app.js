const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
require('dotenv').config()
const {uploadImage} = require('./utils/FileManager')
const userRouter = require('./routes/user')
const {wardrobeRouter} = require('./routes/wardrobe')
const mongoose = require('mongoose')
const { Rp } = require('./utils/ResponseManager')
const jwt = require('jsonwebtoken')
const db = mongoose.connection

const app = express()
const PORT = process.env.PORT || 3000

// middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(fileUpload())

async function auth(req, res, next){
    let {token} = req.body

    if(!token)
        token = req.headers['x-wuru-auth']

    if(!token)
        return res.status(403).send(Rp("Token missing", 403, false))

    const payload = await jwt.verify(token, process.env.JWT_SECRET)
    console.log(payload)
    req.userInfo = payload

    next()
}

// Routers
app.use('/u', userRouter)
app.use('/w', auth, wardrobeRouter)
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

app.get('/wardrobe', (req, res) => {
    res.send("All category of wardrobe")
})

app.get('/wardrobe/:userId', (req, res) => {
    res.send("Wardrobe for user")
})

app.post('/wardrobe', (req, res) => {
    res.send("Wardrobe upload")
})

// app.listen(PORT, () => {
//     console.log("Server started at " + PORT)
// })

mongoose.connect(process.env.MONGO_CONNECTION_STRING)

db.on('connected', () => {
    console.log("Mongoose - Connected")
    app.listen(PORT, () => {
        console.log("Server started at " + PORT)
    })  
})
db.on('error', (err) => {
    console.log("Mongoose - Error")
    console.log(err)
})
db.on('disconnected', () => {
    console.log("Mongooose - Disconnected")
})
process.on('SIGINT', () => {
    db.close(() => {
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
    })
})