let AWS = require("aws-sdk");

//Create new DocumentClient
let documentClient = new AWS.DynamoDB.DocumentClient();

//Returns all of the connection IDs
module.exports.getConnectionIds = async () => {
    let params = {
        TableName: "WebSocketClients"
    };
    return documentClient.scan(params).promise();
};
//returns sentiment dataa
module.exports.getSentimentaData = async () => {
    let params = {
        TableName: "SentimentData"
    };
    return documentClient.scan(params).promise();
};
module.exports.getCryptoPrediction = async (currency) => {
    //params to query  data by currency symbol
    let params = {
        TableName: "PredictionData",
        ScanIndexForward: true,
        KeyConditionExpression: "CurrencySymbol = :curr",
        ExpressionAttributeValues: {
            ":curr": currency
        }
    };
    return documentClient.query(params).promise();
};

module.exports.getCryptoData = async (currency) => {
    //params to query  data by currency symbol
    let params = {
        TableName: "CryptoData",
        ScanIndexForward: true,
        KeyConditionExpression: "CurrencySymbol = :curr",
        ExpressionAttributeValues: {
            ":curr": currency
        }
    };
    return documentClient.query(params).promise();
};

//Deletes the specified connection ID
module.exports.deleteConnectionId = async (connectionId) => {
    console.log("Deleting connection Id: " + connectionId);

    let params = {
        TableName: "WebSocketClients",
        Key: {
            ConnectionId: connectionId
        }
    };
    return documentClient.delete(params).promise();
};

