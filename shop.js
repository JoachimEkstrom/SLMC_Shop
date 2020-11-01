const express = require('express')
const router = express.Router()
const fetch = require("node-fetch")
const moment = require("moment")
const authToken = require("./authToken.js")
require('dotenv').config()


router.post('/', authToken, (req, res) => {

    console.log(req.body)
    console.log(req.user.name)
    let bodyi = {
        name: req.user.name,
        article: req.body.article,
        amount: req.body.amount
    }
    let date, deliveryStatus


    fetch(`${process.env.DBIP}/store`, {
        method: 'post',
        body:    JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(resf => resf.json())
    .then(json => {
        if ( json.status === 200 && json.newValue >= 0 ){
            deliveryStatus ="Item in stock, putting down an order"
            date = moment().add(3, 'days').calendar({sameElse: 'DD/MM/YYYY'});
            getOrderNumber(res, bodyi, date, deliveryStatus)
        } else if (json.status === 200 && json.newValue < 0){
           
            deliveryStatus ="Out of stock, putting down order with a long delivery time."
            date = moment().add(10, 'days').calendar({sameElse: 'DD/MM/YYYY'});
            getOrderNumber(res, bodyi, date, deliveryStatus)
        } else {
            console.log("Error")
            res.sendStatus(json.status)
        }
    })
    
})

router.post('/deliver', authToken, (req, res) => {

    console.log(req.body.orderNr)
    let orderNr = req.body.orderNr

    fetch(`${process.env.EMAIL}`, {
        method: 'post',
        body:    JSON.stringify(orderNr),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(resf => resf.json())
    .then(json => {
        console.log(json)
        res.send(json)
        
    })
    
})


function getOrderNumber(res, body, date, deliveryStatus) {

    fetch(`${process.env.DBIP}/orders`, {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(resf => resf.json())
    .then(json => {
        if ( json.status === 200){
            body.orderNumber = json.orderNumber
            body.delivieryStatus = deliveryStatus
            body.deliveryTime = date
            console.log(body)
            res.send(body)
        } else {
            body.orderNumber = ""
            console.log(body)
            res.send(body)
        }
    })

}

module.exports = router