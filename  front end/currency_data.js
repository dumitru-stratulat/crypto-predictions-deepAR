
//Prices update every second
let timeInterval = 1000;

//Number of data points to generate
let numTimeIntervals = 100;

//Add dummy data for four currencies
function getCurrencyData(cryptoData,cryptoPredictionArray) {
    //Create Date class so we can obtain a starting timestamp

    //Names of currencies, their average prices and arrays to store the generated x and y values
    let currencyData = [
        { name: "BTC", averagePrice: 3800, x: [], y: [] },
        // { name: "ETH", averagePrice: 128, x: [], y: [] },
        // { name: "ADA", averagePrice: 31, x: [], y: [] },
        // { name: "DOGE", averagePrice: 0.03, x: [], y: [] },
        // { name: "MATIC", averagePrice: 0.03, x: [], y: [] }
    ];

    // for (let ts = 0; ts < numTimeIntervals * timeInterval; ts += timeInterval) {
    //     //Add random data for each of the currencies to the database
    currencyData.forEach(currency => {
        cryptoData.forEach(data => {
            if (currency.name === data.CurrencySymbol) {
                // console.log("btc"+new Date(data.CryptoTS))
                let date = new Date(data.CryptoTS);
                currency.x.push(date);
                currency.y.push(data.ClosePrice);
                const tmw = date.getDate()+1;
                // console.log("Date"+new Date(data.CryptoTS+ (24* 3600 * 1000 * 24)))
            }
        })

    });
    // }

    //Remove average price property - we only needed it to generate data
    currencyData.forEach(currency => {
        delete currency.averagePrice;
    });

    //Log final result and return
    //console.log(currencyData);
    return currencyData;
}
