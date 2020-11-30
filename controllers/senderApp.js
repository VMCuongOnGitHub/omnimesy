const express = require("express")
const sendersApps = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")

const idGenerated = require("../helper/helper")

const SenderApp = require("../models/SendersApps.js")
sendersApps.use(cors())

process.env.SECRET_KEY = 'secret'


exports.AddSenderApp = (req,res) => {
  const today = new Date()
  const senderAppData = {
    sender_app_id : idGenerated(32),
    sender_id: req.body.sender_name,
    app_id: req.body.system_id,
    created_date: today
  }

  SenderApp.findOne({
    where: {
      sender_id: req.body.sender_id
    }
  }).then(senderApp => {
    if(!senderApp){
      SenderApp.create(senderAppData).then(senderApp=>{
        res.json({status: senderApp.sender_app_id + " is here"})
      }).catch(err=>{
        res.send('error: ' + err)
      })
    }else{
      res.json({error: "senderappid aready exist"})
    }
  }).catch(err => {
    res.send('error: ' + err)
  })
}

exports.GetAllSenders = (req, res) =>{
  Apps.findAll({
    include:[{
      model: SendersApps,
      where:{sender_id: req.body.sender_id}
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
