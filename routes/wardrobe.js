const express = require('express')
const wardrobeRouter = express.Router()
const {Catagories, Wardrobe} = require('../model/wardrobe')
const { Rp, Rpo } = require('../utils/ResponseManager')

const axios = require('axios')
const FormData = require('form-data')

const IMAGE_HOST_URL = "https://freeimage.host/api/1/upload"
const IMAGE_HOST_API_KEY = process.env.IMAGE_HOST_API_KEY



wardrobeRouter.get("/", async (req, res) => {
    const cat = await Catagories.create({
        no: req.body.no,
        name: req.body.name
        // casual, formal, etinic, party
    })

    // await Catagories.deleteMany({no:1001})

    res.send(Rp(cat.toJSON))
})

wardrobeRouter.get('/myCollection', async (req, res) => {
    const myColl = await Wardrobe.find({createdBy: req.userInfo.uid})

    console.log(myColl)

    res.send(Rpo({"wardrobe": myColl}))
})

wardrobeRouter.get('/categories', async (req, res) => {
    const cat = await Catagories.find()

    console.log(cat)

    res.send(Rpo({"catagories":cat}))
})

wardrobeRouter.post('/addToCollection', async (req, res) => {

    const {category} = req.body

    if(!category){
        return res.send(Rp("Category missing"), 400, false)
    }
    const {image} = req.files
    if(!image) {
        console.log("File missing")
        return res.send("File missing")
    }
    
    else {
        console.log(image)
        console.log("File found - POST")
        let imageData = image.data.toString('base64')
        
        const form = FormData()
        form.append("key", IMAGE_HOST_API_KEY)
        form.append("source", imageData)

        console.log("Uploading file")
        axios.post(IMAGE_HOST_URL, form, { headers : form.getHeaders() })
            .then(async (response) => {

                const imageURL = response.data.image.image.url
                if(imageURL == null)
                    imageURL = response.data.image.display_url

                if(imageURL == null){
                    console.log("Upload failed")
                    return res.send("Upload failed for some reason")
                }

                console.log("Upload successful")
                console.log("Pushing to DB")

                const newWard = await Wardrobe.create({
                    wType: category,
                    userId: req.userInfo.uid,
                    imageURL: imageURL,
                    notes: req.body.notes
                })

                if(!newWard){
                    console.log("Some issue while adding image url")
                    return res.send(Rp("DB Issue"))
                }
                console.log("URL added to DB")
                res.send(Rpo(newWard))
            }).catch((err) => {
                console.log(err.response)
                res.json(err.message)
            })

    }
})


module.exports = {wardrobeRouter}