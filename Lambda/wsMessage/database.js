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
//getting crypto data from db
module.exports.getCryptoData = async () => {
    let params = {
        TableName: "CryptoData",
        ScanIndexForward: true,
        KeyConditionExpression: "CurrencySymbol = :curr",
        ExpressionAttributeValues: {
            ":curr": "BTC"
        }
    };
    return documentClient.scan(params).promise();
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
//getting crypto prediction
module.exports.getCryptoPrediction = async (currency) => {
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
