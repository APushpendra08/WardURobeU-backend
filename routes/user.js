const userRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const userSchema = require('../schema/userSchema')

const userModel = mongoose.model('users', userSchema)

userRouter.get("/adduser", async (req, res) => {
    let newUser = new userModel({firstName:"Allo", lastName: "halfway", user_id:"N/A"})
    newUser.save().then((dbRes) => {
        res.send({
            status: "user add successful",
            result: dbRes
        })
    }).catch(e => {
        console.log("User creation failed")
        res.send({
            status: "user creation failed",
            result: e 
        })
    })
})

userRouter.route('/', (req, res) => {
    res.send("Please login")
})



// jwt
userRouter.get("/signIn", (req, res) => {
    res.send("SignIn")
})

module.exports = userRouter