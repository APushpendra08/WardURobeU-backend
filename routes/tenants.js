const tenantRouter = require('express').Router()
const {v4: uuid} = require('uuid')
const tenantSchema = require("../schema/tenantSchema")
const { default: mongoose } = require('mongoose')
const { DBRef } = require('mongodb')
const tenantModel = mongoose.model("tenants", tenantSchema)

tenantRouter.post("/createTenant", (req, res) => {
    let tenantName = req.body.tenantName
    let time = Date.now()
    let fixture = tenantName + "" + time

    let unique_id = uuid()

    console.log(tenantName + " " +time)

    let newTenant = new tenantModel({
        name: tenantName,
        uid: unique_id
    })
    
    newTenant.save().then(DBRes => {
        res.send(DBRes)
    }).catch(e => {
        res.send(e)
    })

    // res.send("Create new tenant")
    
})



module.exports = tenantRouter