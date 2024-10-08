require('dotenv').config()
const User = require("../models/user")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.auth = async (req.res. next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.SECRET)
        const user = await User.findOne({_id: data._id})
        if (!user) {
            throw new Error(`Bad Credencials`)
        }
        req.user = user
        next()
        } catch (error) {
            res.status(401).json({ message: error.message})
    }
}

exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.json({user, token })
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
            if(!user || !await bcrypt.compare(req.body.password, user.password )){
                throw new Error('Invalid Login Credentials')
            } else {
                const token = await user.generateAuthToken()
                res.json({user, token})
            }
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}