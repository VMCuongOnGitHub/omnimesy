const express = require("express")
const senders = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")

const idGenerated = require("../helper/helper")
const CircularJSON = require('circular-json');

const Sender = require("../models/Senders")
const SenderApp = require("../models/SendersApps")
senders.use(cors())

process.env.SECRET_KEY = 'secret'


exports.AddSender = (req,res) =>{
  const today = new Date()
  let sender_id = idGenerated(32)
  const senderData = {
    sender_id : sender_id,
    sender_name: req.body.sender_name,
    system_id: req.body.system_id,
    channel: req.body.channel,
    sender_information: req.body.sender_information,
    created_date: today
  }

  const senderAppData = {
    sender_app_id : idGenerated(64),
    sender_id : sender_id,
    app_id : req.body.app_id,
    created_date : today
  }

  Sender.findOne({
    where: {
      system_id: req.body.system_id
    }
  }).then(sender => {
    if(!sender){
      Sender.create(senderData).then(sender=>{
        SenderApp.create(senderAppData).then(senderApp=>{
          console.log(senderApp.sender_app_id + " is created");
        }).catch(err=>{
          console.log(err)
        })
        res.json({status: sender.sender_name + " is here"})
      }).catch(err=>{
        res.send('error: ' + err)
      })
    }else{
      res.json({error: "sender aready exist"})
    }
  }).catch(err => {
    res.send('error: ' + err)
  })
}

exports.GetSenderID = (req,res) =>{
  Sender.findAll({
    where:{system_id: req.body.system_id},
    raw: true,
    nest: true,
  }).then((ress)=>{
    let jsonString = CircularJSON.stringify(ress)
    let obj = JSON.parse(jsonString);
    // console.log()
    res.json(obj[0].sender_id)
  }).catch(err => {
    res.send("error : " + err)
  })
}
