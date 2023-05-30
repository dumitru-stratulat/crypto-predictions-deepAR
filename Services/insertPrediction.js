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
var PutDemo;
(function (PutDemo) {
    //Link to AWS-SDK
    var AWS = require('aws-sdk');
    var axios = require('axios');
    //Tell AWS about region
    AWS.config.update({
        region: 'us-east-1',
        endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
    });
    function getNews() {
        return __awaiter(this, void 0, void 0, function () {
            var params, data, k, counter, documentClient, _i, _a, price;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = {
                            RequestItems: {
                                PredictionData: []
                            }
                        };
                        data = [
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
                        ];
                        k = 0;
                        counter = 1;
                        documentClient = new AWS.DynamoDB;
                        _i = 0, _a = data.slice(0, 50);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        price = _a[_i];
                        k++;
                        //pushing in news data array to send to dnamo db
                        return [4 /*yield*/, params.RequestItems.PredictionData.push({
                                PutRequest: {
                                    Item: {
                                        CurrencySymbol: { "S": "ETH" },
                                        //parsing time
                                        time: { "N": k.toString() },
                                        ClosePrice: { "S": price.toString() },
                                    }
                                }
                            })
                            //batching in size of 5 
                        ];
                    case 2:
                        //pushing in news data array to send to dnamo db
                        _b.sent();
                        //batching in size of 5 
                        if (counter % 5 == 0 && counter != 0) {
                            // insert in dynamo db
                            documentClient.batchWriteItem(params, function (result, err) {
                                if (err)
                                    console.log(err);
                                else
                                    console.log(result);
                            });
                            params.RequestItems.PredictionData.length = 0;
                        }
                        counter++;
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    getNews();
    // getNews("ADA","cardano");
    // getNews("ETH","ethereum");
    // getNews("DOGE","dogecoin");
    // getNews("MATIC","polygon");
})(PutDemo || (PutDemo = {}));
