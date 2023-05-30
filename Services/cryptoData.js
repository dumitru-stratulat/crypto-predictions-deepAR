var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CryptoData;
(function (CryptoData) {
    //Link to AWS-SDK
    var AWS = require('aws-sdk');
    var axios = require('axios');
    //Tell AWS about region
    AWS.config.update({
        region: 'us-east-1',
        endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
    });
    //getting price history
    function getPriceHistory(currencySymbol) {
        return __awaiter(this, void 0, void 0, function () {
            var url, dataJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=' + currencySymbol + '&market=USD&apikey=URSN09EHOCQSB92E';
                        return [4 /*yield*/, axios.get(url)];
                    case 1:
                        dataJson = _a.sent();
                        return [4 /*yield*/, dataJson];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function insertCrptoIntoDB(currencySymbol) {
        return __awaiter(this, void 0, void 0, function () {
            var cryptoHistoryArray, data, nestedObjects, timeSeriesData, counter, date, arr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cryptoHistoryArray = [];
                        return [4 /*yield*/, getPriceHistory(currencySymbol)];
                    case 1:
                        data = _a.sent();
                        nestedObjects = Object.values(data)[5];
                        timeSeriesData = Object.values(nestedObjects)[1];
                        counter = 1;
                        arr = [];
                        //get from object that has 500+ rows of data, insert in array data needed
                        Object.entries(timeSeriesData).slice(0, 500).forEach(function (_a) {
                            var key = _a[0], val = _a[1];
                            cryptoHistoryArray.push({ date: key, closePrice: Object.values(val)[7] });
                            arr.push(Number(Object.values(val)[7]));
                            date = key;
                            //batch size 20 
                            if (counter % 20 == 0 && counter != 0) {
                                //object to insert in aws
                                var params = {
                                    RequestItems: {
                                        CryptoData: []
                                    }
                                };
                                //from sliced object iterate in array
                                for (var _i = 0, cryptoHistoryArray_1 = cryptoHistoryArray; _i < cryptoHistoryArray_1.length; _i++) {
                                    var cryptoData = cryptoHistoryArray_1[_i];
                                    //pushing in array
                                    params.RequestItems.CryptoData.push({
                                        PutRequest: {
                                            Item: {
                                                CurrencySymbol: { "S": currencySymbol },
                                                CryptoTS: { "N": (Date.parse(cryptoData.date)).toString() },
                                                Date: { "S": cryptoData.date },
                                                ClosePrice: { "S": cryptoData.closePrice }
                                            }
                                        }
                                    });
                                }
                                //init dynamo db
                                var documentClient = new AWS.DynamoDB;
                                //insert in dynamo db using batch and promise
                                documentClient.batchWriteItem(params, function (result, err) {
                                    if (err)
                                        console.log(err);
                                    else
                                        console.log(result);
                                });
                                //reset array for now batch
                                cryptoHistoryArray.length = 0;
                            }
                            counter++;
                        });
                        // console.log(arr);
                        console.dir(arr.reverse(), { 'maxArrayLength': null });
                        return [2 /*return*/];
                }
            });
        });
    }
    // insertCrptoIntoDB("BTC")
    // insertCrptoIntoDB("ADA")
    insertCrptoIntoDB("ETH");
    // insertCrptoIntoDB("DOGE")
    // insertCrptoIntoDB("MATIC")
})(CryptoData || (CryptoData = {}));
