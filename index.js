const express = require("express")
const app = express()
const shop = require('./shop.js')
require('dotenv').config()
const port = Number(process.env.PORT) 

app.use(express.json())

app.use("/shop", shop)


app.listen(port, ()=> {

    console.log(`Server running at http://localhost:${port}`)

})

