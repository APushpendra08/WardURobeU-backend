const { default: mongoose } = require("mongoose");

const loggerSchema = new mongoose.Schema({
    timestamp: String,
    data: String,
    loglevel: String
})

module.exports = loggerSchema