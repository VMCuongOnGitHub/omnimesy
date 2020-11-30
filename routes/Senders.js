const express = require("express")
const senders = express.Router()
const SenderController = require("../controllers/senders")

senders.post("/addsender", SenderController.AddSender)
senders.post("/getsenderid", SenderController.GetSenderID)

module.exports = senders
