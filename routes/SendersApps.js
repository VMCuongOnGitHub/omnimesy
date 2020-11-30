const express = require("express")
const users = express.Router()
const SenderAppController = require("../controllers/sendersApps")

users.post("/addSenderApp", SenderAppController.AddSenderApp)

module.exports = users
