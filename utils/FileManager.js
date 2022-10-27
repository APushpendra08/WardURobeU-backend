const axios = require('axios')
const FormData = require('form-data')

const IMAGE_HOST_URL = "https://freeimage.host/api/1/upload"
const IMAGE_HOST_API_KEY = process.env.IMAGE_HOST_API_KEY

function uploadImage(imageData, res){
    const form = FormData()
    form.append("key", IMAGE_HOST_API_KEY)
    form.append("source", imageData)

    console.log("Uploading file")
    axios.post(IMAGE_HOST_URL, form, { headers : form.getHeaders() })
        .then((response) => {

            const imageURL = response.data.image.image.url
            if(imageURL == null)
                imageURL = response.data.image.display_url

            if(imageURL == null){
                console.log("Upload failed")
                return res.send("Upload failed for some reason")
            }

            console.log("Upload successful")
            res.send(imageURL)
        }).catch((err) => {
            console.log(err.response)
            res.json(err.message)
        })
}

module.exports = {uploadImage}