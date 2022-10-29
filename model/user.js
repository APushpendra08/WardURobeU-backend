const {Schema, model} = require('mongoose')

const userSchema = Schema({
    name: { type: String, default: null},
    email: { type: String, default: null},
    password: {type: String, default: null},
    pic: String,
    token: {type: String}
}, {timestamps: true})

const User = model("user", userSchema)

module.exports = User