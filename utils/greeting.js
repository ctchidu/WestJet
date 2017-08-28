var request = require('request');
var config = require('../config.js').getConfig();

var apiai = require('apiai')
var api = apiai(config.apiaitoken);


var facebookGreeting = function(event) {
	var sender_id = event.sender.id;
		let messageData = {
			  "recipient":{
				"id":sender_id
			  },
			  "message":{
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"What do you want to do next?",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://www.messenger.com",
            "title":"Visit Messenger"
          },
          {
            "type":"web_url",
            "url":"https://www.messenger.com",
            "title":"Visit Messenger"
          }
        ]
      }
    }
  }
		}	
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




module.exports = {	
    facebookGreeting
}
