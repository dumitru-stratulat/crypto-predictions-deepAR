namespace  PutDemo {
	//Link to AWS-SDK
    const AWS = require('aws-sdk');
    var axios = require('axios');

	//Tell AWS about region
	AWS.config.update({
		region: 'us-east-1',
		endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
    });

    async function getNews() {
        //object signature to insert with batching in aws 
        var params:any = {
            RequestItems: {
                PredictionData: [   

              ]
            }
          };
          interface Article {
            title: string;
            author: string;
            source: {
              id: string | null;
              name: string;
            };
            publishedAt: string;
            url: string;
          }
          
          interface Response {
            status: string;
            totalResults: number;
            articles: Article[];
          }
          
        //!!!!!!api data must be for 1 month 
        //getting data from api
        const data = [
          1862.6934814453,
          1828.9425048828,
          1836.7611083984,
          1849.0546875,
          1823.1912841797,
          1819.4248046875,
          1847.2309570312,
          1857.8734130859,
          1820.3990478516,
          1850.28125,
          1856.5447998047,
          1870.97265625,
          1890.0726318359,
          1848.4619140625,
          1885.2473144531,
          1874.0092773438,
          1874.1955566406,
          1908.9787597656,
          1908.9852294922,
          1884.1320800781,
          1936.4096679688,
          2014.7944335938,
          2052.1823730469,
          2012.2028808594,
          2043.8913574219,
          2112.9350585938,
          2100.7412109375,
          2119.5258789062,
          2120.7248535156,
          2111.4416503906,
          2085.8308105469,
          2107.8486328125,
          2080.2258300781,
          2071.2446289062,
          2094.4133300781,
          2121.2456054688,
          2059.9228515625,
          2080.3706054688,
          2037.8674316406,
          2023.2204589844,
          2052.263671875,
          2043.2727050781,
          2033.8736572266,
          2073.681640625,
          2043.8391113281,
          2000.0375976562,
          1961.7221679688,
          2017.2972412109,
          2002.078125,
          2015.494140625
      ]
          let k:number = 0;
        let counter:number = 1;
        let documentClient = new AWS.DynamoDB;
        //usually getting 90 data points from api, slicing to needed amount
        for (const price of data.slice(0,50)) {
            k++;
            //pushing in news data array to send to dnamo db
            await params.RequestItems.PredictionData.push(
                {
                    PutRequest: {
                        Item: {
                            CurrencySymbol: { "S": "ETH" },
                            //parsing time
                            time: { "N": k.toString()},
                            ClosePrice: { "S": price.toString()},
                        }
                    }
                },
            )
            //batching in size of 5 
            if(counter % 5  == 0 && counter != 0) {
                // insert in dynamo db
                documentClient.batchWriteItem(params,(result:any,err:any)=>{
                    if(err)
                        console.log(err)
                    else
                        console.log(result)    
                })
                params.RequestItems.PredictionData.length = 0;
            }
            counter++;
        }
        
      
    }
    getNews();
    // getNews("ADA","cardano");
    // getNews("ETH","ethereum");
    // getNews("DOGE","dogecoin");
    // getNews("MATIC","polygon");
}
