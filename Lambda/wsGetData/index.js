let AWS = require("aws-sdk");

//Import functions for database
let db = require('database');
let processSentiment = require('processSentiment')

exports.handler = async (event) => {
    //get specific data from event about websocket
    let domainName = event.requestContext.domainName;
    let stage = event.requestContext.stage;
    let connectionId = event.requestContext.connectionId;
    let currency = JSON.parse(event.body).currency;


    //store db data in arrays 
    let cryptoDataArray = (await db.getCryptoData(currency)).Items;
    let cryptoPredictionArray = (await db.getCryptoPrediction(currency)).Items;
    let sentimentData = (await db.getSentimentaData()).Items;
    //sort crypto sentiment
    let sentimentArray = await processSentiment.processSentiment(sentimentData)
    //Create API Gateway management class.
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        endpoint: domainName + '/' + stage
    });
    try {
        // Create parameters for API Gateway
        let apiMsg = {
            ConnectionId: connectionId,
            Data: JSON.stringify({ cryptoData: cryptoDataArray, sentimentArray, cryptoPredictionArray })

        };

        //Wait for API Gateway to execute and log result
        await apigwManagementApi.postToConnection(apiMsg).promise();
    }
    catch (err) {
        console.log("Failed to send message to: " + event.requestContext.connectionId);

        //Delete connection ID from database
        if (err.statusCode == 410) {
            try {
                await db.deleteConnectionId(event.requestContext.connectionId);
            }
            catch (err) {
                console.log("ERROR deleting connectionId: " + JSON.stringify(err));
                throw err;
            }
        }
        else {
            console.log("UNKNOWN ERROR: " + JSON.stringify(err));
            throw err;
        }
    }
    return { statusCode: 200, body: "Data sent successfully." };

};



