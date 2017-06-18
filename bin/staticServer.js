const express = require('express')
const path = require('path')

const app = express()
const public = path.join(__dirname, '..', 'public')
app.use(express.static(public))
app.listen(process.env.PORT)
console.log(`Listening on ${process.env.PORT}`)