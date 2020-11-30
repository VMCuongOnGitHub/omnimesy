const express = require("express")
const messages = express.Router()
const cors = require("cors")

const idGenerated = require("../helper/helper")


const Messages = require("../models/Messages")
// const Message = require("../models/Messages")
const SendersApps = require("../models/SendersApps")
const CircularJSON = require('circular-json');

messages.use(cors())

process.env.SECRET_KEY = 'secret'


exports.addMessage = (req,res) =>{
  const today = new Date()
  const messageData = {
    message_id : idGenerated(32),
    message_content: req.body.message_content,
    message_type: req.body.message_type,
    message_sentiment: req.body.message_sentiment,
    sender_id: req.body.sender_id,
    user_id: req.body.user_id,
    from_sender: req.body.from_sender,
    created_date: today
  }
  console.log(messageData);
  Messages.create(messageData)
  // Messages.create(messageData).then(message=>{
  //   console.log("messgage here");
  //   res.json({status: message.message_content + " is created"})
  // }).catch(err=>{
  //   res.send('error: ' + err)
  // })
}


exports.GetAllMessages = (req, res) =>{
  Messages.findAll({
      where:{sender_id: req.body.sender_id},
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
