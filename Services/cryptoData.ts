

namespace  CryptoData {
	//Link to AWS-SDK
    const AWS = require('aws-sdk');
    var axios = require('axios');

	//Tell AWS about region
	AWS.config.update({
		region: 'us-east-1',
		endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
    });
   //getting price history
   async function getPriceHistory(currencySymbol:string):Promise<apiData>{
        var url = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol='+currencySymbol+'&market=USD&apikey=URSN09EHOCQSB92E';
        let dataJson = await axios.get(url);

        return await dataJson;
    }
    interface apiData {
      [key: string]:{
          [key: string]:{
            [key: string]:number
          }
      },
    }
    interface nestedObjectInterface {
      [key: string]:{
          [key: string]:number
    },
  }
    interface timeSeries {
            [key: string]:number
    }

     async function insertCrptoIntoDB(currencySymbol:string){
         //get needed data from nested object
        const cryptoHistoryArray:Array<{date:string,closePrice:number}> = [];
        const data:apiData =  await getPriceHistory(currencySymbol);
        let nestedObjects:nestedObjectInterface = Object.values(data)[5];
                //data object of time series dagta
        let timeSeriesData:timeSeries = Object.values(nestedObjects)[1];
        let counter:number = 1;
        let date:any;
        let arr:any = [];
  //get from object that has 500+ rows of data, insert in array data needed
        Object.entries(timeSeriesData).slice(0,500).forEach(([key, val]:[string,number]) => {
        

          cryptoHistoryArray.push({date:key,closePrice:Object.values(val)[7]})
          arr.push(Number(Object.values(val)[7]));
          date = key;
        //batch size 20 
            if(counter % 20  == 0 && counter != 0) {
              //object to insert in aws
              var params:any = {
                RequestItems: {
                    CryptoData: [
            
                  ]
                }
              };
        //from sliced object iterate in array

            for(const cryptoData of cryptoHistoryArray){
                     //pushing in array
                params.RequestItems.CryptoData.push(
                      {
                           PutRequest: {
                             Item: {
                                 CurrencySymbol: { "S": currencySymbol },
                                 CryptoTS: { "N":(Date.parse(cryptoData.date)).toString()},
                                 Date: { "S": cryptoData.date },
                                 ClosePrice: { "S": cryptoData.closePrice }
                             }
                           }
                         },
                )
         
            }
        
             //init dynamo db
            let documentClient = new AWS.DynamoDB;
             //insert in dynamo db using batch and promise
            documentClient.batchWriteItem(params,(result:any,err:any)=>{
                if(err)
                    console.log(err)
                else

                    console.log(result)    
            })
                 //reset array for now batch
            cryptoHistoryArray.length = 0;
            }
            counter++
            });
            // console.log(arr);
            console.dir(arr.reverse(), {'maxArrayLength': null})
   
    }
    // insertCrptoIntoDB("BTC")
    // insertCrptoIntoDB("ADA")
    insertCrptoIntoDB("ETH")
    // insertCrptoIntoDB("DOGE")
    // insertCrptoIntoDB("MATIC")
}
