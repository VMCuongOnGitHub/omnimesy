const express = require("express")
const apps = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const idGenerated = require("../helper/helper")
const CircularJSON = require('circular-json');


const Apps = require("../models/Apps")
const UsersApps = require("../models/UsersApps")
const Users = require("../models/Users")

const { now } = require("jquery")
const { ResolvePlugin } = require("webpack")
apps.use(cors())

process.env.SECRET_KEY = 'secret'



exports.AddApp = (req,res) =>{
  const today = new Date()
  const app_id = idGenerated(32)
  const appData = {
    app_id : app_id,
    app_name: req.body.app_name,
    webhook_url: req.body.webhook_url,
    facebook_page_token: req.body.facebook_page_token,
    zalo_access_token: req.body.zalo_access_token,
    viber_access_token: req.body.viber_access_token,
    created_date: today
  }
  const userAppData = {
    user_app_id : idGenerated(64),
    user_id : req.body.user_id,
    app_id : app_id,
    role_as : "1",
    created_date : today
  }

  Apps.findOne({
    where: {
      app_name: req.body.app_name
    }
  }).then(app => {
    if(!app){
      Apps.create(appData).then(app=>{
        UsersApps.create(userAppData).then(userApp=>{
          console.log(userApp.user_app_id + " is created");
        }).catch(err=>{
          console.log(err)
        })
        res.json({status: app.app_name + " is created"})
      }).catch(err=>{
        res.send('error: ' + err)
      })
    }else{
      res.json({error: "app name is exist"})
    }
  }).catch(err => {
    res.send('error: ' + err)
  })


}

exports.DeleteApp = (req,res) =>{
  Apps.destroy({
    where:{
      app_id: req.body.app_id
    },
    force: true
  }).then((app)=>{
    res.json({status: app.app_name + " is deleted"})
  }).catch(err => {
    res.send("error : " + err)
  })
}

exports.GetAllApps = (req, res) =>{
  Apps.findAll({
    include:[{
      model: UsersApps,
      where:{user_id: req.body.user_id}
    }],
    order: [
      ['created_date', 'DESC']
  ],
    raw: true,
    nest: true,
  }).then((ress)=>{
    let jsonString = CircularJSON.stringify(ress)
    let obj = JSON.parse(jsonString);
    // console.log(obj)
    res.json(obj)
  }).catch(err => {
    res.send("error : " + err)
  })
}

exports.GetFBToken = (req,res) =>{
  Apps.findAll({
    where:{app_id: req.body.app_id},
    raw: true,
    nest: true,
  }).then((ress)=>{
    let jsonString = CircularJSON.stringify(ress)
    let obj = JSON.parse(jsonString);
    // console.log()
    res.json(obj[0].facebook_page_token)
  }).catch(err => {
    res.send("error : " + err)
  })
}

exports.GetAllApps = (req, res) =>{
  Apps.findAll({
    include:[{
      model: UsersApps,
      where:{user_id: req.body.user_id}
    }],
    order: [
      ['created_date', 'DESC']
  ],
    raw: true,
    nest: true,
  }).then((ress)=>{
    let jsonString = CircularJSON.stringify(ress)
    let obj = JSON.parse(jsonString);
    // console.log(obj)
    res.json(obj)
  }).catch(err => {
    res.send("error : " + err)
  })
}
