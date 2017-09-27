
fs = require('fs')
var parseXlsx = require('excel')
var config = require('../config.js').getConfig();
var nodemailer = require('nodemailer');
var jsonData,statusData,allData;






function formatApiaiResponse(speech, displayText) {
    return {
        "speech": speech,
        "displayText": displayText,
        "source": "heroku"
    }
}

function convertToJSON(array) {
  var first = array[0].join()
  var headers = first.split(',');

  var jsonData = [];
  for ( var i = 1, length = array.length; i < length; i++ )
  {

    var myRow = array[i].join();
    var row = myRow.split(',');

    var data = {};
    for ( var x = 0; x < row.length; x++ )
    {
      data[headers[x]] = row[x];
    }
    jsonData.push(data);

  }
  return jsonData;
};

	  	parseXlsx('BAG_FARE_DATA.xlsx', function(err, data) {			
		 jsonData = JSON.parse(JSON.stringify(convertToJSON(data)));
		console.log('getting bag fare');	
		});

	  	parseXlsx('ALLITEMS.xlsx', function(err, data) {			
		 allData = JSON.parse(JSON.stringify(convertToJSON(data)));
		console.log('getting allData');	
		});

	 statusData =[
				{
					"bagtag_id": "1234567890",
					"status" : "Your bag is reaching Calgary @ 6 AM tomorrow and will be delivered at given address by 9 AM tomorrow."
				},
				{
					"bagtag_id" : "3651201478",
					"status" : "Tracing continues,Please check back later"
				},
				{
					"bagtag_id" : "2104796325",
					"status" : "Forwarding to delivery airport"
				}
			];



var fulfillmentRequest = function(request, response) {
    var body = request.body;
    if (!body | !body.result.action) {
        console.log('missing action in request.');
    } else {
        console.log('Valid fulfillment request received.');
        var action = body.result.action;
        var parameters = body.result.parameters;
                              
        switch(body.result.action) {
              
             case 'baggagefare':   
             
		var locationcountry = body.result.parameters.locationcountry;
                var travelclass = body.result.parameters.travelclass;
		var frequentfly = body.result.parameters.frequentfly;
		var str;
			
			
			

		if(frequentfly){
                var travelclass = travelclass.toUpperCase();
		var frequentfly = frequentfly.toUpperCase();
		console.log(travelclass);
		console.log(frequentfly);	
		if(frequentfly == 'NONE'){
			travelclass = travelclass;
		   }else{
			   travelclass = frequentfly;
		   }
		console.log(travelclass);
		console.log(frequentfly);
			
		for(i = 0; i < jsonData.length; i++){
		 if((jsonData[i].CLASS == travelclass)){	
			      					  str  = {
						  "speech": jsonData[i].FARE,
						  "displayText": jsonData[i].FARE,
						  "data": {
						    "google": {
						      "expectUserResponse": true,
						      "isSsml": false,
						      "noInputPrompts": [],
						      "richResponse": {
							"items": [
							  {
							    "simpleResponse": {
							      "textToSpeech": jsonData[i].DETAIL
							    }
							  },
							  {
							    "basicCard": {
							      "title": "",
							      "subtitle": "",
							      "formattedText": jsonData[i].GOOGLE,
							      "image": {},
							      "buttons": [
								{
								  "title": "Read more",
								  "openUrlAction": {
								    "url": "https://www.westjet.com/en-ca/travel-info/fares/our-fares/options"
								  }
								}
							      ]
							    }
							  }
							]
						      }
							}
						  }
						};	 			 
			 }				 
		  }
									
			
			
		}
		response.json(str);
		break;
                
         case 'all.items':

		var allitems = body.result.parameters.allitems;
		var typeofbaggage = body.result.parameters.typeofbaggage;	
		if(allitems == 'carry on baggage'){
                        var str = fs.readFileSync('./carryon.txt', 'utf8');
                        var json = {
					  "speech":str,
					  "data": {
					    "google":
					    {
					      "expectUserResponse":true,
					      "richResponse":
					      {
						"items":
						[
						  {
						    "simpleResponse":
						    {
						      "textToSpeech":"Carry-on Baggage"
						    }
						  }
						],
						"suggestions":
						[
						  {
						    "title":"Sports"
						  },
						  {
						    "title":"Music"
						  },
						  {
						    "title":"Hunting"
						  }
						]
					      },
					      "systemIntent":
					      {
						"intent":"actions.intent.OPTION",
						"data":
						{
						  "@type":"type.googleapis.com/google.actions.v2.OptionValueSpec",
						  "carouselSelect":
						  {
						    "items":
						    [
						      {
							"optionInfo":
							{
							  "key":"title",
							  "synonyms":
							  [
							    "synonym of title 1",
							    "synonym of title 2",
							    "synonym of title 3"
							  ]
							},
							"title":"Standard Article",
							"description":"Regardless of your destination, you can bring 1 standard article. Kindly click above for more queries.",
							"image":
							{
							  "url":"https://raw.githubusercontent.com/ctchidu/WestJet/master/std-article.png",
							  "accessibilityText":"Image alternate text"
							}
						      },
						      {
							"optionInfo":
							{
							  "key":"googleHome",
							  "synonyms":
							  [
							    "Google Home Assistant",
							    "Assistant on the Google Home"
							  ]
							},
							"title":"Personal Article",
							"description":"Regardless of your destination, you can bring 1 personal article. Kindly click above for more queries.",
							"image":
							{
							  "url":"https://raw.githubusercontent.com/ctchidu/WestJet/master/personal-article.png",
							  "accessibilityText":"Google Home"
							}
						      }
						    ]
						  }
						}
					      }
					    }
					  }
					};
                    }	
			else{
			    					
					
			for(i = 0; i < allData.length; i++){
			
				if(allData[i].ALLITEMS == allitems ){
					 var json = {
						  "speech": allData[i].DESCRIPTION.concat(allData[i].LINK),
						  "displayText": allData[i].DESCRIPTION.concat(allData[i].LINK),
						  "data": {
						    "google": {
						      "expectUserResponse": true,
						      "isSsml": false,
						      "noInputPrompts": [],
						      "richResponse": {
							"items": [
							  {
							    "simpleResponse": {
							      "textToSpeech": allData[i].DETAIL
							    }
							  },
							  {
							    "basicCard": {
							      "title": "",
							      "subtitle": "",
							      "formattedText": allData[i].DESCRIPTION,
							      "image": {},
							      "buttons": [
								{
								  "title": "Read more",
								  "openUrlAction": {
								    "url": allData[i].LINK
								  }
								}
							      ]
							    }
							  }
							]
						      }
							}
						  }
						};
					
				}
				
			}


			    
			    
		    }
                response.json(json);
                break;   
                
                
             case 'payment':   
	      var str = fs.readFileSync('./payment.txt', 'utf8');
	      var json = formatApiaiResponse(speech = str,displayText = str)  
             response.json(json);
             break;
			
			
	     case 'exceldata':
			
		var splItems = body.result.parameters.splItems;
	
		
			parseXlsx('exceldata.xlsx', function(err, data) {
 		var a = true;	
			var jsonData = JSON.parse(JSON.stringify(convertToJSON(data)));
			for(i = 0; i < jsonData.length; i++){
     
			 if(jsonData[i].NAME == splItems){
				 var a = false;
				 var json = {
						  "speech": jsonData[i].DESCRIPTION.concat(jsonData[i].LINK),
						  "displayText": jsonData[i].DESCRIPTION.concat(jsonData[i].LINK),
						  "data": {
						    "google": {
						      "expectUserResponse": true,
						      "isSsml": false,
						      "noInputPrompts": [],
						      "richResponse": {
							"items": [
							  {
							    "simpleResponse": {
							      "textToSpeech": jsonData[i].DETAIL
							    }
							  },
							  {
							    "basicCard": {
							      "title": "",
							      "subtitle": "",
							      "formattedText": jsonData[i].DESCRIPTION,
							      "image": {},
							      "buttons": [
								{
								  "title": "Read more",
								  "openUrlAction": {
								    "url": jsonData[i].LINK
								  }
								}
							      ]
							    }
							  }
							]
						      }
							}
						  }
						};
				 response.json(json);
             			 break;
				 }	 
			  }		
		if(a){
		      var str = fs.readFileSync('./fallback.txt', 'utf8');
		      var json = formatApiaiResponse(speech = str,displayText = str)  
		     response.json(json);
  		 }
		});        			
	break;
			
			
		case 'status':
			
			var snumber = body.result.parameters.snumber;
			
			var str,finalresult;
			if(snumber){
			for(i = 0; i < statusData.length; i++){
			
				if(statusData[i].bagtag_id == snumber){
					 str = statusData[i].status;
					
				}
				
			}
				
						finalresult = {
  "speech": str,
  "displayText": str,
  "data": {
    "google": {
      "expectUserResponse": true,
      "isSsml": false,
      "noInputPrompts": [],
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": "Baggage status"
            }
          },
          {
            "basicCard": {
              "title": "",
              "subtitle": "",
              "formattedText": str,
              "image": {},
              "buttons": [
                {
                  "title": "Read more",
                  "openUrlAction": {
                    "url": "https://www.aircanada.com/ca/en/aco/home/plan/baggage/delayed-damaged-baggage.html"
                  }
                }
              ]
            }
          },
		      {
      "simpleResponse": {
        "textToSpeech":"To make any changes to delivery schedule, I can connect you with our Customer Representative.Do you want to proceed ?",
        "displayText":"To make any changes to delivery schedule, I can connect you with our Customer Representative.Do you want to proceed ?"
      }
    }
		  
		  
        ]
      }
	}
  }
};
			
			

			}	
			response.json(finalresult);
			break;
			
			
			
        }
    }
}


module.exports = {
    fulfillmentRequest
}
