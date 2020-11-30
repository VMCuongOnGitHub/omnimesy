const express = require("express")
const messages = express.Router()
const MessageController = require("../controllers/messages")


messages.post("/addMessage", MessageController.addMessage)
messages.post("/getAllMessages", MessageController.GetAllMessages)


module.exports = messages
