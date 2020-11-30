const Sequelize = require("sequelize")
const db = require("../database/db");

// const User = require("../models/Users")
// const App = require("../models/Apps")

const UserApp = db.sequalize.define(
  "usersapps",
  {
    user_app_id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.STRING,
      // references: {
      //   model: User,
      //   key: 'user_id'
      // }
    },
    app_id: {
      type: Sequelize.STRING,
      // references: {
      //   model: App,
      //   key: 'app_id'
      // }
    },
    role_as: {
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

// User.belongsToMany(App, {through: UserApp, as: 'apps', foreignKey: 'user_id'})
// App.belongsToMany(User, {through: UserApp, as: 'users', foreignKey: 'app_id'})

module.exports = UserApp
