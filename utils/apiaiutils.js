
fs = require('fs')

function formatApiaiResponse(speech, displayText) {
    return {
        "speech": speech,
        "displayText": displayText,
        "source": "heroku"
    }
}


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
             
                var travelclass = body.result.parameters.travelclass;
                var locationcountry = body.result.parameters.locationcountry;
                if(travelclass =='economy') {
                   if(locationcountry == 'canada'){
                        var str = fs.readFileSync('./canada.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                 if(locationcountry == 'US'){
                        var str = fs.readFileSync('./us.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                 if(locationcountry == 'SUN'){
                        var str = fs.readFileSync('./sun.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                 if(locationcountry == 'international'){
                        var str = fs.readFileSync('./international.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                       }
                
                
                if(travelclass =='premium economy') {
                   if(locationcountry == 'canada'){
                        var str = fs.readFileSync('./premiumcanada.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                 if(locationcountry == 'US'){
                        var str = fs.readFileSync('./premiumus.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                 if(locationcountry == 'SUN'){
                        var str = fs.readFileSync('./premiumsun.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                 if(locationcountry == 'international'){
                        var str = fs.readFileSync('./premiuminternational.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                       }
                
                
                if(travelclass =='business') {
                   if(locationcountry == 'canada'){
                        var str = fs.readFileSync('./businesscanada.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                 if(locationcountry == 'US'){
                        var str = fs.readFileSync('./businessus.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                 if(locationcountry == 'SUN'){
                        var str = fs.readFileSync('./businesssun.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                 if(locationcountry == 'international'){
                        var str = fs.readFileSync('./businessinternational.txt', 'utf8');
                        var json = formatApiaiResponse(speech = str,displayText = str)
                }
                       }
              
             response.json(json);
             break;
                
                
             case 'checkedcarryon':
                
                 var checkRejected = ["Bobsleighs","Bobsleighs",
                        "Canoes","Canoes",
                        "Hang gliders","Hang gliders","gliders",
                        "Luges","Luges",
                        "Vaulting poles","Vaulting poles","vaulting",
                        "Windsurfing equipment","Windsurfing equipment","Windsurfing"];
                
    var carryAccepted = ["Carry-on bag","Carry-on bag","carry on bag","roller bag","backpack","briefcase",
                        "laptop","laptop",
                        "Cat","Cat","small dog","pets",
                        "duty-free purchases","duty-free purchases","duty free",
                        "Sport racquet","Sport racquet","tennis","squash","badminton","musical instrument",
                        "Camera bag","Camera bag","diplomatic","consular bag","Garment bag",
                        "guitars","guitars","violins","violas"];

        
              
                var typeofbaggage = body.result.parameters.typeofbaggage;
                var splItems = body.result.parameters.splItems;
                
             
                
                
                
                
                
             response.json(json);
             break;   
                
                
                
                
                
                
                
        }
    }
}


module.exports = {
    fulfillmentRequest
}
