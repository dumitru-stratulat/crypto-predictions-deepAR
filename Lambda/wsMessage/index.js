//Import external library with websocket functions
let ws = require('websocket');
let db = require('database');
//Hard coded domain name and stage - use when pushing messages from server to client
let domainName = "4zdyw4q7f9.execute-api.us-east-1.amazonaws.com";
let stage = "prod";

exports.handler = async (event) => {
    //if records not insert then return empty body
    if (event.Records[0].eventName != "INSERT") {
        return { statusCode: 200, body: [] };
    }
    //currency symbol
    let currency = event.Records[0].dynamodb.Keys.CurrencySymbol.S;
    //get prediction
    let cryptoPredictionArray = (await db.getCryptoPrediction(currency)).Items
    try {
        let dataArray = [];

        //iterating every record getting info and put in array to be sent to front end
        for (let record of event.Records) {

            let ClosePrice = record.dynamodb.NewImage.ClosePrice.S;
            let CryptoTS = record.dynamodb.NewImage.CryptoTS.N;
            CryptoTS = parseInt(CryptoTS);
            let CurrencySymbol = record.dynamodb.NewImage.CurrencySymbol.S;
            let Date = record.dynamodb.NewImage.Date.S;
            let data = {
                CurrencySymbol,
                Date,
                ClosePrice,
                CryptoTS
            }
            dataArray.push(data);

        }
        //object to be sent to front end
        let payloadObject = {
            functionName: "wsMessage",
            cryptoData: dataArray,
            cryptoPredictionArray
        }
        //send to front end via websocket
        var sendMsgPromises = await ws.getSendMessagePromises(payloadObject, domainName, stage);
        // //Execute promises
        await Promise.all(sendMsgPromises);
    }
    catch (err) {
        return { statusCode: 500, body: "Error: " + JSON.stringify(err) };
    }

    //Success
    return { statusCode: 200, body: "Data sent successfully." };
};
