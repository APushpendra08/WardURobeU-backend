const express = require('express')
const userRouter = express.Router()
const User = require('../model/user')

const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {Rp, Rpo} = require('../utils/ResponseManager')

userRouter.use(bodyParser.json())

userRouter.post("/signUp", async (req, res) => {
    handleRegistration(req, res)
})

userRouter.post("/signIn", (req, res) => {
    handleLogin(req, res)
})

let handleRegistration = async (req, res) => {
    const {name, email, password} = req.body

    // password is already hashed
    if(!name || !email || !password){
        res.status(400).send(Rp("Invalid entry", 400, false))
    } else {

        const alreadyUser = await User.findOne({email})

        if(alreadyUser){
            res.status(409).send(Rp("User already exists", 409, false))
        } else {
            registerUser(name, email, password, res)
        }

    }
}

let registerUser = async (username, email, password, res) => {

    encryptedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        name: username,
        email: email,
        password: encryptedPassword,
        pic: "",
        token: ""
    })

    jwtToken = await generateToken(user._id, email)
    
    res.send(Rpo({token: jwtToken}))
}


let handleLogin = (req, res) => {
    const {email, password} = req.body

    // password is already hashed
    if(!email || !password){
        res.status(400).send(Rp("Invalid entry", 400, false))
    } else {
        loginUser(email, password, res)
    }
}

let loginUser = async (email, password, res) => {

    const userExists = await User.findOne({email})

    if(!userExists){
        return res.send(Rp("User doesn't exists", 404, false))
    }

    token = await generateToken(userExists._id, email)

    res.send(Rpo({token}))
}

let generateToken = async (uid, email) => {
    return await jwt.sign({
        uid, 
        email
    }, process.env.JWT_SECRET)
}


module.exports = userRouter