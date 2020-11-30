const express = require("express")
const fbChat = express.Router()
const cors = require("cors")
const axios = require("axios")
const idGenerated = require("../helper/helper")

const Facebook = require('facebook-node-sdk');

axios.defaults.baseURL = 'http://localhost:5000'

const request = require('request');



fbChat.use(cors())
// const facebook = new Facebook({"facebookPageToken": facebookPageToken})


exports.postWebhook = async (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  let facebookPageToken = await getFBToken(req.params.appid)
  const facebook = new Facebook({"facebookPageToken": facebookPageToken})
  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach( async function(entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);

      let sender_id = await getSenderID(sender_psid)

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message && !sender_id.data.includes("error")) {
        // handleMessage(sender_psid, webhook_event.message, facebookPageToken);

        addNewMessage(webhook_event.message.text, "text", "0", sender_id.data, "NULL", "cus")
        // addNewMessage(webhook_event.message, 'text', '0', sender_psid, 'user_id')
        getSenderData(sender_psid, facebookPageToken.data, req.params.appid)
        // let get_sender_data = getSenderData(sender_psid, facebookPageToken)
        // console.log("data : " + get_sender_data)
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
}

exports.getWebhook = (req, res) => {
  let VERIFY_TOKEN = req.params.appid
  console.log(VERIFY_TOKEN);

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}

exports.sendFBMessage = async (req, res) => {
  console.log('send message');

  let sender_psid = req.body.sender_id
  let user_id = req.body.user_id
  let message = req.body.message
  let facebookPageToken = req.body.facebookPageToken

  let sender_id = await getSenderID(sender_psid)

  console.log('send message: ' + sender_id.data);
  await handleTextMessage(sender_psid, message, facebookPageToken)

  // let messageSentiment = getSentiment(message)

  await addNewMessage(message, "text", "0", sender_id.data, user_id, "sup")
}


function addNewMessage(message_content, message_type, message_sentiment, sender_id, user_id, sender){
  console.log(message_content + "-" + message_type + "-" + message_sentiment + "-" + sender_id + "-" + user_id + "-" + sender);
  axios.post('messages/addMessage', {
    message_content: message_content,
    message_type: message_type,
    message_sentiment: message_sentiment,
    sender_id: sender_id,
    user_id: user_id,
    from_sender: sender
  }).then( () => {
    console.log('New message added');
  }).catch(error => {
    console.log('Add message error: ' + error)
  })
}


function getSenderData(sender_psid, facebookPageToken, app_id){

  request({
    uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${facebookPageToken}`,
    method: "GET"
  },(error, res, body) => {
    if(!error){
      // console.log(sender_psid + "-" + facebookPageToken + "-" + app_id)
      axios.post('senders/addsender', {
        system_id: JSON.parse(body).id,
        channel: "facebook",
        sender_name: JSON.parse(body).first_name + ' ' + JSON.parse(body).last_name,
        sender_information: "",
        app_id: app_id
      }).then( () => {
        console.log('New sender added');
      }).catch(error => {
        console.log('Add sender error: ' + error)
      })
    }else{
      console.log(error);
    }
  })
}


function handleTextMessage(sender_psid, received_message, facebookPageToken) {
  let response;
  // Check if the message contains text
  if (received_message) {
    // Create the payload for a basic text message
    response = {
      "text": received_message
    }
  }
  // Sends the response message
  callSendAPI(sender_psid, response, facebookPageToken);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response, facebookPageToken) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v6.0/me/messages",
    "qs": { "access_token": facebookPageToken },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
      console.log(`My message: ${response}`)
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

function getFBToken(app_id){
  return new Promise((resolve, reject) => {
    axios.post(`apps/GetFBToken`, {
      app_id: app_id
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}


function getSenderID(system_id){
  return new Promise((resolve, reject) => {
    axios.post(`senders/getsenderid`, {
      system_id: system_id
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
