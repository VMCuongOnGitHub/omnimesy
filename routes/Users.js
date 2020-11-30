const express = require("express")
const users = express.Router()
const UserController = require("../controllers/users")

users.post("/register", UserController.Register)
users.post("/login", UserController.LogIn)

module.exports = users
