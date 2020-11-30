const Sequelize = require("sequelize")
const db = require("../database/db");

// const SenderApp = require("../models/SendersApps")
const User = require("../models/Users")

const Message = db.sequalize.define(
  "messages",
  {
    message_id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    message_content: {
      type: Sequelize.STRING,
    },
    message_type: {
      type: Sequelize.STRING
    },
    message_sentiment: {
      type: Sequelize.STRING
    },
    sender_id: {
      type: Sequelize.STRING
    },
    user_id: {
      type: Sequelize.STRING
    },
    from_sender: {
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

// Message.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: true }})
// User.hasMany(Message, { foreignKey: { name: 'user_id', allowNull: false }})

// Message.belongsTo(Sender, { foreignKey: { name: 'sender_id', allowNull: true }})
// Sender.hasMany(Message, { foreignKey: { name: 'sender_id', allowNull: false }})

// Message.hasMany(SenderApp, {foreignKey: 'sender_id'});
// SenderApp.belongsTo(Message, {foreignKey: 'sender_id', targetKey: 'sender_id'});

module.exports = Message
