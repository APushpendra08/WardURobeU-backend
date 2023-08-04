const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
    EVENT_NAME: String,
    EVENT_ATTRIBUTES: Object
})

module.exports = eventSchema