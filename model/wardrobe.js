const {Schema, model} = require('mongoose')

const catagoriesSchema = Schema({
    no: {type: Number},
    name: {type: String}
})

const wardrobeSchema = Schema({
    wType: {type: Number},
    userId: {type: String},
    imageURL: {type: String},
    notes: {type: String}
})

const Catagories = model("Categories", catagoriesSchema)
const Wardrobe = model("Wardrobe", wardrobeSchema)

module.exports = {Catagories, Wardrobe}