const Sequelize = require("sequelize")
const db = require("../database/db");

const UserApp = require("../models/UsersApps")
// const App = require("../models/Apps")

const User = db.sequalize.define(
  "users",
  {
    user_id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    account_name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    account_password: {
      type: Sequelize.STRING
    },
    register_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  },{
    timestamps: false
  }
)

User.hasMany(UserApp, {foreignKey: 'user_id'});
UserApp.belongsTo(User, {foreignKey: 'user_id', targetKey: 'user_id'});



module.exports = User
