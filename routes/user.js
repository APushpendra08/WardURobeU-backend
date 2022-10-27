const express = require('express')
const userRouter = express.Router()
const bodyParser = require('body-parser')
const {Rp} = require('../utils/ResponseManager')

userRouter.use(bodyParser.json())

userRouter.post("/signUp", (req, res) => {
    const {username, password} = req.body

    // password is already hashed
    if(!username || !password){
        res.status(400).send(Rp("Invalid entry", 400, false))
    } else {
        res.send(Rp(username + password))
    }
})

userRouter.get('/', (req, res) => {
    res.send("Please login")
})

// jwt
userRouter.post("/signIn", (req, res) => {
    res.send("SignIn")
})

module.exports = userRouter