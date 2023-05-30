let index = require('index');
//return sorted crypto sentiment data
module.exports.processSentiment = async (sentimentData) => {

    //filter data into variables
    let BTC = sentimentData.filter(data => data.CurrencySymbol === "BTC");
    let ADA = sentimentData.filter(data => data.CurrencySymbol === "ADA");
    let DOGE = sentimentData.filter(data => data.CurrencySymbol === "DOGE");
    let MATIC = sentimentData.filter(data => data.CurrencySymbol === "MATIC");
    let ETH = sentimentData.filter(data => data.CurrencySymbol === "ETH");
    //get sentiment data and stoe in array
    let dataArray = [await helper(MATIC, "MATIC"), await helper(DOGE, "DOGE"), await helper(ADA, "ADA"), await helper(BTC, "BTC"), await helper(ETH, "ETH")];

    return dataArray;

}
const helper = async (currencyData, currencySymbol) => {
    let neutral = 0;
    let positive = 0;
    let negative = 0;
    let mixed = 0;
    //calculate sentiment
    await currencyData.map((data) => {
        if (data.articleSentiment == "NEUTRAL") neutral++;
        if (data.articleSentiment == "POSITIVE") positive++;
        if (data.articleSentiment == "NEGATIVE") negative++;
        if (data.articleSentiment == "MIXED") mixed++;
    })
    //store in object
    let dataObject = {
        currencySymbol: currencySymbol,
        neutral,
        positive,
        negative,
        mixed,
        size: currencyData.length
    }
    return dataObject;
}