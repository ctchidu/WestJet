var request = require('request');
var config = require('../config.js').getConfig();

var apiai = require('apiai')
var api = apiai(config.apiaitoken);

function facebookBagStatus(event) {
  
  var sender_id = event.sender.id;
  var messageData = {
    recipient: {
      id: sender_id
    },
    message: {
                    attachment: {
                type: "template",
                payload: {
                  template_type: "generic",
                  elements: [{
                    title: "Thank you for contacting us.",
                    subtitle: "Kindly visit our site for more information on baggage status.",
                    image_url: "https://raw.githubusercontent.com/ctchidu/WestJet/master/baggagestatus.jpg",
                    buttons: [{
			          type:"web_url",
                url:"https://westjet.nettracer.aero/paxview/login.do",
                title:"View Website"
                    }]
                  }]
                }
              }
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



module.exports = {	
    facebookBagStatus
}
