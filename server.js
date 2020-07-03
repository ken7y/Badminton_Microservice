var victorURL = "https://badmintoncentre.yepbooking.com.au/ajax/ajax.schema.php?";
var secondURL = "&id_sport=1&event=pageLoad&tab_type=normal&numberOfDays=init&_=";
var complexSecondURL = "&event=pageLoad&tab_type=normal&numberOfDays=init&_=";
var nbcURL = "https://nbc.yepbooking.com.au/ajax/ajax.schema.php?"

// nbc id = 3 = homebush 
// nbc id = 1 = silverwater
const axios = require('axios');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
app.listen(port);


app.get('/', (req, res) => {
    return res.send("alive");
});


app.get('/today', (req, res) => {
    var victor = ProcessSimpleURL(victorURL, secondURL)
    var nbc_silverwater = ProcessSimpleURL(nbcURL, secondURL);
    var nbc_homebush = ProcessComplexURL(nbcURL,complexSecondURL, "3")


    const requestOne = axios.get(victor);
    const requestTwo = axios.get(nbc_silverwater);
    const requestThree = axios.get(nbc_homebush);

    axios
    .all([requestOne, requestTwo, requestThree])
    .then(
      axios.spread((...responses) => {
        return res.send(ProcessResponse(responses));
      })
    )
    .catch(errors => {
      console.error(errors);
    });
  });

  app.get('/tomorrow', (req, res) => {
    var victor = ProcessSimpleURL(victorURL, secondURL, true)
    var nbc_silverwater = ProcessSimpleURL(nbcURL, secondURL, true);
    var nbc_homebush = ProcessComplexURL(nbcURL,complexSecondURL, "3", true)

    const requestOne = axios.get(victor);
    const requestTwo = axios.get(nbc_silverwater);
    const requestThree = axios.get(nbc_homebush);

    axios
    .all([requestOne, requestTwo, requestThree])
    .then(
      axios.spread((...responses) => {
        return res.send(ProcessResponse(responses));
      })
    )
    .catch(errors => {
      console.error(errors);
    });
  });


function ProcessResponse(responses) { 
    dict = {};
    var responseOne = responses[0];
    var responseTwo = responses[1];
    var responseThree = responses[2];
    dataOne = responseOne.data;
    var regex = /title=".{1,20} Available"/g;
    var found = dataOne.match(regex);
    if (found) {found = found.map(x => x.substring(7, x.length - 13))};
    dict["victor"] = found;
    dataTwo = responseTwo.data;
    console.log(dataTwo)
    regex = /title=".{1,20} Available"/g;
    found = dataTwo.match(regex);
    if (found) {found = found.map(x => x.substring(7, x.length - 13))};
    dict["nbc_silverwater"] = found;
    dataThree = responseThree.data;
    regex = /title=".{1,20} Available"/g;
    found = dataThree.match(regex);
    if (found) {found = found.map(x => x.substring(7, x.length - 13))};
    dict["nbc_homebush"] = found;
    return dict
}
  

function ProcessSimpleURL (URLstart, URLend, tomorrow=false){
    var newDate = new Date();

    if (tomorrow) {
        var tomorrow = new Date(newDate)
        tomorrow.setDate(tomorrow.getDate() + 1)
        newDate = tomorrow;
    }

    var dateString = "day=" + newDate.getDate() + "&month=" + (newDate.getMonth() + 1) + "&year=" + newDate.getFullYear();
    var unixTime = Math.round((new Date()).getTime());
    return (URLstart + dateString + URLend + unixTime);
}

function ProcessComplexURL (URLstart, URLend, id_sport, tomorrow=false){
    var newDate = new Date();

    if (tomorrow) {
        var tomorrow = new Date(newDate)
        tomorrow.setDate(tomorrow.getDate() + 1)
        newDate = tomorrow;
    }

    var dateString = "day=" + newDate.getDate() + "&month=" + (newDate.getMonth() + 1) + "&year=" + newDate.getFullYear();
    var unixTime = Math.round((new Date()).getTime());
    var sportsString = "id_sport=" + id_sport
    return (URLstart + dateString + "&" + sportsString + URLend + unixTime);
}






