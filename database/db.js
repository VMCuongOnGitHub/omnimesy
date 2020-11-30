const Sequalize = require("sequelize")
const db = {}

const sequalize = new Sequalize("omnimesy_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  operatorAliases: false,
  pool:{
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})


db.sequalize = sequalize
db.Sequalize = Sequalize

module.exports = db
