const Sequelize = require("sequelize")
const db = require("../database/db");

const SenderApp = require("../models/SendersApps")

const Sender = db.sequalize.define(
  "senders",
  {
    sender_id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    system_id: {
      type: Sequelize.STRING,
    },
    channel: {
      type: Sequelize.STRING
    },
    sender_name: {
      type: Sequelize.STRING
    },
    sender_information: {
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

Sender.hasMany(SenderApp, {foreignKey: 'sender_id'});
SenderApp.belongsTo(Sender, {foreignKey: 'sender_id', targetKey: 'sender_id'});

module.exports = Sender
