const {mongoose} = require('mongoose')
const mongooseUniqueValidator = require('mongoose-unique-validator')

const tokenSchema = new mongoose.Schema({
    token: { type: String, unique: true },
    timestamp: String,
    service: String
})

tokenSchema.plugin(mongooseUniqueValidator)

module.exports = tokenSchema