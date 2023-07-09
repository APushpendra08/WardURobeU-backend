const { default: mongoose } = require("mongoose");

const pingSchema = new mongoose.Schema({
    timestamp: String,
    platform: String,
})

module.exports = pingSchema