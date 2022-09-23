const userRouter = require('express').Router()


userRouter.route("/signUp", (req, res) => {
    res.send("SignUp")
})

userRouter.route('/', (req, res) => {
    res.send("Please login")
})



// jwt
userRouter.route("/signIn", (req, res) => {
    res.send("SignIn")
})

module.exports = userRouter