require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./model/user')
const auth =require('./middleware/auth')

const app = express()
app.use(express.json())

app.get('/', (req, res)=> {
    res.send('<h1> Hello from auth system - server </h1>')
})

app.post('/register', async (req, res)=> {
    try {
        const {firstname, lastname, email, password} = req.body
        if (!(email && password && firstname && lastname)) {
            res.status(400).send('All fields are required')
        }
    
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(401).send('User already exists')
        }
    
        const myEncPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            firstname,
            lastname,
            email: email.toLowerCase(),
            password: myEncPassword
        })

        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.SECRET_KEY,
            {
                expiresIn: '2h'
            }
        )
        user.token = token
        user.password = undefined

        res.status(201).json(user)
    } catch (error) {
        console.log(error)
    }
})

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        if (!(email && password)) {
            res.status(400).send('Filed is missing')
        }
        const user = await User.findOne({email})        
        const DBpassword = await bcrypt.compare(password, user.password)
        if (user && DBpassword) {
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.SECRET_KEY,
                {
                    expiresIn: '2h'
                }
            )
            user.token = token
            user.password = undefined
            res.status(200).json(user)
        }
        res.status(400).send('email or password is incorrect')
    } catch (error) {
        console.log(error)
    }
})

app.get('/dashboard', auth, (req, res) => {
    res.send('welcome home')
})

module.exports = app