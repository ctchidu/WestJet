var express = require('express');
var app = express();
var body_parser = require('body-parser');
var request = require('request');

// Loading tokens
var config = require('./config.js').getConfig();

// Import API.AI and identify with token
var apiai = require('apiai');
var api = apiai(config.apiaitoken);
fs = require('fs')
var parseXlsx = require('excel')

// Import our own webhook functions
var apiaiUtils = require('./utils/apiaiutils.js');
var facebookUtils = require('./utils/facebookutils.js');
var facebookGreeting = require('./utils/greeting.js');
var facebookBagFare = require('./utils/facebookBagFare.js');
var facebookBagStatus = require('./utils/facebookBagStatus.js');

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    "recipient": {
      "id": recipientId
    },
    "message": {
      "text": messageText,
      "metadata": "DEVELOPER_DEFINED_METADATA"
    }
  };

  sendMessage(messageData);
}

// Send a message via the Facebook Graph API
var sendMessage = function(messageData) {
    request({
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: config.facebook.pageAccessToken },
        method: "POST",
        json: messageData
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            if (messageId) {
                console.log("Successfully sent message with id %s to recipient %s",
                messageId, recipientId);
            } else {
                console.log("Successfully called Send API for recipient %s",
                recipientId);
            }
        } else {
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
    });
}


// Define port
app.set('port', (process.env.PORT || 5000));

// Parser for forms
var json_body_parser = body_parser.json();
var url_body_parser = body_parser.urlencoded({ extended: false });

// Webhook for Facebook - Subscription
app.get('/facebook', json_body_parser, function(request, response) {
    if ((request.query['hub.mode'] === 'subscribe')
    && (request.query['hub.verify_token'] === config.facebook.verification_token)) {
        console.log('Facebook webhook validated');
        response.status(200).send(request.query['hub.challenge']);
    } else {
        console.error('Failed Facebook webhook validation.');
        response.sendStatus(403);
    }
})

// Webhook for Facebook - handle message requests
app.post('/facebook', json_body_parser, function(req, response) {
    const data = req.body;
    if (data.object === "page") {
        data.entry.forEach(pageEntry => {
            pageEntry.messaging.forEach(messagingEvent => {
                if (messagingEvent.message) {
                    if (!messagingEvent.message.is_echo) {
                        facebookUtils.handleFacebookTextMessage(messagingEvent);
                    }
                }
                else if (messagingEvent.postback && messagingEvent.postback.payload) {
			console.log(messagingEvent.postback.payload);
			var sender_id = messagingEvent.sender.id;
                            if (messagingEvent.postback.payload === "FACEBOOK_WELCOME") {
				                facebookGreeting.facebookGreeting(messagingEvent);
                            }else if(messagingEvent.postback.payload === "baggage fare"){
				    facebookBagFare.facebookBagFare(messagingEvent);
				     
			    }else if(messagingEvent.postback.payload === "baggage status"){
				    facebookBagStatus.facebookBagStatus(messagingEvent);
				     
			    }else if(messagingEvent.postback.payload === "sports"){
				    var str = fs.readFileSync('./sportsallitems.txt', 'utf8');
				    sendTextMessage(sender_id,str);
				     
			    }else if(messagingEvent.postback.payload === "music"){
				    var str = fs.readFileSync('./music.txt', 'utf8');
				    sendTextMessage(sender_id,str);
				     
			    }else if(messagingEvent.postback.payload === "hunting"){
				    var str = fs.readFileSync('./hunting.txt', 'utf8');
				    sendTextMessage(sender_id,str);
				     
			    }else{
                                facebookUtils.handleFacebookTextMessage(messagingEvent);
                            }
                        }
            })
        })
    }
    response.sendStatus(200);
})

// Webhook for API.AI -  request for a fulfillment
app.post('/apiai', json_body_parser, function(request, response) {
    // API.AI requires help for a customized question
    apiaiUtils.fulfillmentRequest(request, response);
})

// Launching server
app.listen(app.get('port'), function() {
    console.log('Node app is running on port ', app.get('port'));
})
module.exports = app;
