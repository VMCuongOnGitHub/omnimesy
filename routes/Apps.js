const express = require("express")
const apps = express.Router()
const AppController = require("../controllers/apps")


apps.post("/addApp", AppController.AddApp)
apps.post("/deleteApp", AppController.DeleteApp)
apps.post("/getAllApps", AppController.GetAllApps)
apps.post("/GetFBToken", AppController.GetFBToken)


module.exports = apps
