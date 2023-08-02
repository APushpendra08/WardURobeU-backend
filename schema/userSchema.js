const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    user_id: String,
})

module.exports = userSchema