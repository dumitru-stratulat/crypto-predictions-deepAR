function displayPieChart(sentimentData){ 
    sentimentData.map((currency,index)=>{
if(!currency.size){

}else 
{ 
var data = [{
    values: [currency.mixed, currency.negative, currency.neutral,currency.positive],
    labels: ['Mixed', 'Negative', 'Neutral','Positive'],
    type: 'pie'
  }];
  
  var layout = {
    height: 400,
    width: 500,
    plot_bgcolor:"transparent",
    paper_bgcolor:"transparent",
  };
  Plotly.newPlot('pieChart'+currency.currencySymbol, data, layout);
}
})

}