const Sequelize = require("sequelize")
const db = require("../database/db");

const UserApp = require("../models/UsersApps")
const SenderApp = require("../models/SendersApps")
// const User = require("../models/Users")

const App = db.sequalize.define(
  "apps",
  {
    app_id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    app_name: {
      type: Sequelize.STRING,
    },
    webhook_url: {
      type: Sequelize.STRING
    },
    facebook_page_token: {
      type: Sequelize.STRING
    },
    zalo_access_token: {
      type: Sequelize.STRING
    },
    viber_access_token: {
      type: Sequelize.STRING
    },
    created_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  },{
    timestamps: false
  }
)

App.hasMany(UserApp, {foreignKey: 'app_id'});
UserApp.belongsTo(App, {foreignKey: 'app_id', targetKey: 'app_id'});

App.hasMany(SenderApp, {foreignKey: 'app_id'});
SenderApp.belongsTo(App, {foreignKey: 'app_id', targetKey: 'app_id'});

module.exports = App
