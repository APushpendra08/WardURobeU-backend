const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({
    name: String,
    attributes: Object
})

module.exports = eventSchema