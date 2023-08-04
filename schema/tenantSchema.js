const { default: mongoose } = require("mongoose");

const tenantSchema = new mongoose.Schema({
    name: String,
    uid: String
})

module.exports = tenantSchema