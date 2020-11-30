let express = require("express")
let cors = require("cors")
let bodyParser = require("body-parser")
let app = express()

let http = require("http").Server(app)
let io = require("socket.io")(http)

let port = process.env.PORT || 5000


app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))

let Users = require("./routes/Users")
let Apps = require("./routes/Apps")
let Senders = require("./routes/Senders")
let Messages = require("./routes/Messages")
let fbChat = require("./routes/fbChat")

app.use("/users", Users)
app.use("/apps", Apps)
app.use("/senders", Senders)
app.use("/messages", Messages)
app.use("/fbchat", fbChat)

let users = []
let messages = []
let index = 0
io.on("connection", socket => {
  socket.emit("loggedIn", {
    users: users.map(s => s.username),
    messages: messages
  })

  socket.on("newuser", username => {
    console.log(`${username} has arrived`);
    socket.username = username
    users.push(socket)

    io.emit('userOnline', socket.username)
  })

  socket.on("msg", msg => {
    let message = {
      index: index,
      username: socket.username,
      msg: msg
    }
    messages.push(messages)
    io.emit("msg"), messages
    index++
  })

  //Disconnect
  socket.on("disconect", ()=>{
    console.log(`${socket.username} has left the chat`)
    io.emit("userLeft", socket.username)
    users.splice(users.indexOf(socket), 1)
  })
})



app.listen(port, ()=>{
  console.log("Server is running on port: " + port)
})


