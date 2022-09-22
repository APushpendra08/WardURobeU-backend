const express = require('express')
const app = express()
// const userRouter = require('./routes/user')

app.get('/', (req, res) => {
    res.send("Welcome to WardURobeU")
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