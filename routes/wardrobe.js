const router = require('express').Router()

router.get('/wardrobe', (req, res) => {
    res.send("All category of wardrobe")
})

router.get('/wardrobe/:userId', (req, res) => {
    res.send("Wardrobe for user")
})

router.post('/wardrobe', (req, res) => {
    res.send("Wardrobe upload")
})


module.exports = router