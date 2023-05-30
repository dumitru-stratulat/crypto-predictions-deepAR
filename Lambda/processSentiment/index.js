
let AWS = require("aws-sdk");

//Create instance of Comprehend
let comprehend = new AWS.Comprehend();
let documentClient = new AWS.DynamoDB;

let counter = 1;
//Function that will be called
exports.handler = (event) => {

    for (let record of event.Records) {
        //object for sentiment to be sent to dynamodb
        this.params = {
            RequestItems: {
                SentimentData: []
            }
        }
        //call when triggered with insert
        if (record.eventName == "INSERT") {
            let text = record.dynamodb.NewImage.title.S;
            let timeStamp = record.dynamodb.NewImage.timeStamp.N;
            let currencySymbol = record.dynamodb.NewImage.CurrencySymbol.S;
            let params = {
                LanguageCode: "en",//Possible values include: "en", "es", "fr", "de", "it", "pt"
                Text: text
            };
            //sentiment detection promise
            comprehend.detectSentiment(params, async (err, data) => {

                //Log result or error
                if (err) {
                    console.log("\nError with call to Comprehend:\n" + JSON.stringify(err));
                }
                else {
                    console.log("\nSuccessful call to Comprehend:\n" + JSON.stringify(data));
                    //push data in array
                    await this.params.RequestItems.SentimentData.push(
                        {
                            PutRequest: {
                                Item: {
                                    CurrencySymbol: { "S": currencySymbol },
                                    timeStamp: { "N": timeStamp.toString() },
                                    title: { "S": text },
                                    articleSentiment: { "S": data.Sentiment }
                                }
                            }
                        },
                    )
                    //put 5 records in array and send to db
                    if (counter % 5 == 0 && counter != 0) {

                        //send data array to db
                        documentClient.batchWriteItem(await this.params, (result, err) => {
                            if (err)
                                console.log("Error" + JSON.stringify(err))
                            else
                                console.log("Success" + result)
                        })
                        //reset array
                        this.params.RequestItems.SentimentData.length = 0;
                    }
                    counter++;
                };

            });


        }

    }
    return { statusCode: 200, body: "Data sent successfully." };
};



