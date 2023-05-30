namespace  PutDemo {
	//Link to AWS-SDK
    const AWS = require('aws-sdk');
    var axios = require('axios');

	//Tell AWS about region
	AWS.config.update({
		region: 'us-east-1',
		endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
    });

    async function getNews(currencySymbol:string,currencyName:string) {
        //object signature to insert with batching in aws 
        var params:any = {
            RequestItems: {
                NewsData: [

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
        let articles:any = (await axios.get("https://newsapi.org/v2/everything?q="+currencyName+"&from=2023-03-01&to=2023-03-29&sortBy=popularity&language=en&apiKey=c9f743f4127e45c78d3993be2d26592b")).data;
        let counter:number = 1;
        let documentClient = new AWS.DynamoDB;
        //usually getting 90 data points from api, slicing to needed amount
        for (const article of articles.articles.slice(0,10)) {
            //pushing in news data array to send to dnamo db
            await params.RequestItems.NewsData.push(
                {
                    PutRequest: {
                        Item: {
                            CurrencySymbol: { "S": "BTC" },
                            //parsing time
                            timeStamp: { "N": (Date.parse(article.publishedAt)/1000).toString()},
                            title: { "S": article.title },
                            url: { "S": article.url }
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
                params.RequestItems.NewsData.length = 0;
            }
            counter++;
        }
        
      
    }
    // getNews("BTC","bitcoin");
    // getNews("ADA","cardano");
    // getNews("ETH","ethereum");
    getNews("DOGE","dogecoin");
    // getNews("MATIC","polygon");
}
