const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const idGenerated = require("../helper/helper")

const UserController = require("../controllers/users")

const User = require("../models/Users")
users.use(cors())

process.env.SECRET_KEY = 'secret'


exports.Register = (req,res) =>{
  const today = new Date()
  const userData = {
    user_id : idGenerated(32),
    account_name: req.body.account_name,
    email: req.body.email,
    account_password: req.body.password,
  }

  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if(!user){
      User.create(userData).then(user=>{
        res.json({status: user.email + " registed"})
      }).catch(err=>{
        res.send('error: ' + err)
      })
    }else{
      res.json({error: "user aready exist"})
    }
  }).catch(err => {
    res.send('error: ' + err)
  })
}

exports.LogIn = (req,res) =>{
  User.findOne({
    where:{
      email: req.body.email
    }
  }).then(user => {
    if(user){
      if(req.body.password){
        if(req.body.password === user.account_password){
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 1440
          })
          res.send(token)
        }else{
          res.status(400).json({error: "Wrong Password"})
        }
      }else{
        res.status(400).json({error: "You need to fill in your password"})
      }
    }else{
      res.status(400).json({error: "User doesn't exist"})
    }
  }).catch(error => {
    res.status(400).json({error: error})
  })
}
