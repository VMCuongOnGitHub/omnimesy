const Sequelize = require("sequelize")
const db = require("../database/db");


const SenderApp = db.sequalize.define(
  "sendersapps",
  {
    sender_app_id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    sender_id: {
      type: Sequelize.STRING,
    },
    app_id: {
      type: Sequelize.STRING,
    },
    created_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  },{
    timestamps: false
  }
)

module.exports = SenderApp
