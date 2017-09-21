var request = require('request');
var config = require('../config.js').getConfig();

var apiai = require('apiai')
var api = apiai(config.apiaitoken);


var handleFacebookTextMessage = function(event) {
    var question = event.message.text;
    var sender_id = event.sender.id;
    var recipient_id = event.recipient.id;

    if (!question | !sender_id | !recipient_id) {
        console.log('Event is partially defined. Missing question, sender or recipient.');
    } else {
      
        var req_bot = api.textRequest(question, {
            sessionId: sender_id
        });

        req_bot.on('response', function(response_bot) {
            var text = response_bot.result.fulfillment.speech;
            var action = response_bot.result.action;
console.log('facebook');
console.log(text);		

		if((text == 'May I know in which class you are travelling ? Economy or Flex or Plus Lowest or Plus Flexible') && (action == 'baggagefare')){
		   
		   			let messageData = {
					  "recipient":{
						"id":sender_id
					  },
					"message":{
						"text": "May I know in which class you are travelling?",
						    "quick_replies":[
							{"content_type":"text",
							"title":"Economy",
							"payload":"ECONO"
							},
							{"content_type":"text",
							"title":"Flex",
							"payload":"FLEX"
							},
							{"content_type":"text",
							"title":"Plus Lowest",
							"payload":"PLUS LOWEST"
							},
							{"content_type":"text",
							"title":"Plus Flexible",
							"payload":"PLUS FLEXIBLE"
							}    
						    ]
						}
				}	
		   
		   sendMessage(messageData);
		   
		   }else if((text == 'What is your WestJet rewards membership? NONE or Elite or Silver or Gold') && (action == 'baggagefare')){
		   
		   			let messageData = {
					  "recipient":{
						"id":sender_id
					  },
					"message":{
						"text": "May I know your WestJet rewards membership?",
						    "quick_replies":[
							{"content_type":"text",
							"title":"NONE",
							"payload":"NONE"
							},
							{"content_type":"text",
							"title":"ELITE",
							"payload":"ELITE"
							},
							{"content_type":"text",
							"title":"SILVER",
							"payload":"SILVER"
							},
							{"content_type":"text",
							"title":"GOLD",
							"payload":"GOLD"
							}             
						    ]
						}
				}	
		   
		   sendMessage(messageData);
		   
		   }else if((text == 'You want to know about? Sports or Music or Hunting or Restricted items or Carry on baggage') && (action == 'all.items')){
			    
		   			let messageData = {
					  "recipient":{
						"id":sender_id
					  },
					"message":{
						"text": "You want to know about? Sports  or Music  or Hunting  or Restricted items or Carry on baggage",
						    "quick_replies":[
							{"content_type":"text",
							"title":"Sports",
							"payload":"sports"
							},
							{"content_type":"text",
							"title":"Music",
							"payload":"music"
							},
							{"content_type":"text",
							"title":"Hunting",
							"payload":"hunting"
							},
							{"content_type":"text",
							"title":"Restricted items",
							"payload":"restricted"
							},
							{"content_type":"text",
							"title":"Carry on baggage",
							"payload":"Carry on baggage"
							}    
						    ]
						}
				}	
                sendMessage(messageData); 
		   
		   }
		
		
		
		else{
		console.log('google');
            replyMessage(sender_id, response_bot.result.fulfillment);
		}	
        });

        req_bot.on('error', function(error_bot) {
            console.log("Couldn't answer the question");
            console.log(error_bot);
            replyMessage(sender_id, 'Une erreur est survenue. Un opérateur va prendre le relais d\'ici peu.');
        })
    
        req_bot.end();
	   
    }
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

// Responds a message based on text and id of the receiver
var replyMessage = function(recipientId, fulfillment) {
    var speech = fulfillment.speech;
    if ((speech != undefined) & (speech != "")) {
        const messageData = {
            recipient: {
                id: recipientId,
            },
            message: {
                text: speech
            }
        }
        sendMessage(messageData);
    } else {   
        console.log('Facebook message is either empty or undefined.');
    }
}

module.exports = {	
    handleFacebookTextMessage
}
