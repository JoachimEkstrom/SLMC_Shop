const express = require("express")
const app = express()
const shop = require('./shop.js')
require('dotenv').config()
const port = process.env.PORT || 3002

app.use(express.json())

app.use("/shop", shop)


app.listen(port, ()=> {

    console.log(`Server running at http://localhost:${port}`)

})

