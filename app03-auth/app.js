const express = require('express')
const User = require('./model/user')
require('dotenv').config()
require('./config/database').connect()
const app = express()
app.use(express.json())

app.get('/', (req, res)=> {
    res.send('<h1> Hello from auth system - server </h1>')
})

app.get('/register', async (req, res)=> {
    const {firstname, lastname, email, password} = req.body

    if (!(email && password && firstname && lastname)) {
        res.status(400).send('All fields are required')
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        res.status(401).send('User already exists')
    }
})

module.exports = app