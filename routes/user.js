const express = require('express')
const userRouter = express.Router()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const {Rp, Rpo} = require('../utils/ResponseManager')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

userRouter.use(bodyParser.json())

//jwt-generate
userRouter.post("/signUp", async (req, res) => {
    handleRegistration(req, res)
})

// jwt - generate
userRouter.post("/signIn", (req, res) => {
    handleLogin(req, res)
})

let registerUser = async (username, email, password, res) => {

    encryptedPassword = await bcrypt.hash(password, 10)
    
    jwtToken = await jwt.sign({
        uid: 123,
        email: email
    }, process.env.JWT_SECRET)


    res.send(Rpo({token: jwtToken}))
}

let loginUser = async (username, password, token, res) => {

    payload = jwt.verify(token, process.env.JWT_SECRET)

    res.send(Rp(payload))
}

let handleRegistration = async (req, res) => {
    const {name, email, password} = req.body

    // password is already hashed
    if(!name || !email || !password){
        res.status(400).send(Rp("Invalid entry", 400, false))
    } else {
        registerUser(name, email, password, res)
    }
}

let handleLogin = (req, res) => {
    const {username, password, token} = req.body

    // password is already hashed
    if(!username || !password){
        res.status(400).send(Rp("Invalid entry", 400, false))
    } else {
        loginUser(username, password, token, res)
    }
}


module.exports = userRouter