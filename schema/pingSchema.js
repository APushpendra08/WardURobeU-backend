const { default: mongoose } = require("mongoose");

const pingSchema = new mongoose.Schema({
    timestamp: String,
})

module.exports = pingSchema