const {mongoose} = require('mongoose')

const tokenSchema = new mongoose.Schema({
    token: String,
    timestamp: String,
    service: String
})

module.exports = tokenSchema