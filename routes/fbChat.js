const express = require("express")
const fbChat = express.Router()
const fbChatController = require("../controllers/fbChat")


fbChat.post("/fbwebhook/:appid", fbChatController.postWebhook)
fbChat.get("/fbwebhook/:appid", fbChatController.getWebhook)
fbChat.post("/sendfbmessage", fbChatController.sendFBMessage)


module.exports = fbChat


