// Open Bank Project

// Copyright 2011-2016 TESOBE Ltd.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Open Bank Project (http://www.openbankproject.com)
// Copyright 2011-2016 TESOBE Ltd.

// This product includes software developed at
// TESOBE (http://www.tesobe.com/) contact AT tesobe DOT com
// by:
// Nina Gänsdorfer
// Everett Sochowski
// Stefan Bethge
// Simon Redfern

var express = require('express', template = require('jade'));
var session = require('express-session')
var util = require('util');
var oauth = require('oauth');

var app = express();

// To get the values for the following fields, please register your client here:
// https://apisandbox.openbankproject.com/consumer-registration
// Then create a file called config.json in this directory 
// and paste your consumer key and secret like this:
//config.json:
//{ 
//"consumerKey": "YOUR CONSUMER KEY GOES HERE",
//"consumerSecret" : "YOUR CONSUMER SECRET GOES HERE"
//}

// Template engine (previously known as Jade)
var pug = require('pug');

// This loads your consumer key and secret from a file you create.
var config = require('./config.json');

// Used to validate forms
var bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({
//   extended: false
// }));

// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var _openbankConsumerKey = config.consumerKey;
var _openbankConsumerSecret = config.consumerSecret;



var apiHost = config.apiHost;

console.log ("apiHost is: " + apiHost)


var consumer = new oauth.OAuth(
  apiHost + '/oauth/initiate',
  apiHost + '/oauth/token',
  _openbankConsumerKey,
  _openbankConsumerSecret,
  '1.0',                             //rfc oauth 1.0, includes 1.0a
  'http://127.0.0.1:8085/callback',
  'HMAC-SHA1');

var cookieParser = require('cookie-parser');
app.use(session({
  secret: "very secret",
  resave: false,
  saveUninitialized: true
}));


app.get('/connect', function(req, res){
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.status(500).send("Error getting OAuth request token : " + util.inspect(error));
    } else {
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect(apiHost + "/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
    }
  });
});


app.get('/callback', function(req, res){
  consumer.getOAuthAccessToken(
    req.session.oauthRequestToken,
    req.session.oauthRequestTokenSecret,
    req.query.oauth_verifier,
    function(error, oauthAccessToken, oauthAccessTokenSecret, result) {
      if (error) {
        //oauthAccessToken, -Secret and result are now undefined
        res.status(500).send("Error getting OAuth access token : " + util.inspect(error));
      } else {
        //error is now undefined
        req.session.oauthAccessToken = oauthAccessToken;
        req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
        res.redirect('/signed_in');
      }
    }
  );
});


app.get('/signed_in', function(req, res){
  res.status(200).send('Signing in by OAuth worked. Now you can do API calls on private data like this: <br><a href="/getMyAccounts">Get My Accounts</a> <br><a href="/getCurrentUser">Get Current User</a> <br><a href="/createTransactionRequest">Create Transaction Request (make payment)</a> <br> <br> Please see the <a href="https://apiexplorersandbox.openbankproject.com">API Explorer</a> for the full list of API calls available.')
});


app.get('/getCurrentUser', function(req, res){
  consumer.get("https://apisandbox.openbankproject.com/obp/v2.1.0/users/current",
  req.session.oauthAccessToken,
  req.session.oauthAccessTokenSecret,
  function (error, data, response) {
      var parsedData = JSON.parse(data);
      res.status(200).send(parsedData)
  });
});


app.get('/getMyAccounts', function(req, res){
  consumer.get("https://apisandbox.openbankproject.com/obp/v2.1.0/my/accounts",
  req.session.oauthAccessToken,
  req.session.oauthAccessTokenSecret,
  function (error, data, response) {
      var parsedData = JSON.parse(data);
      res.status(200).send(parsedData)
  });
});


app.get('/createTransactionRequest', function(req, res){
  

  var template = "./template/createTransactionRequest.pug";
  var options = null; 
  var html = pug.renderFile(template, options);


  consumer.get("https://apisandbox.openbankproject.com/obp/v2.1.0/my/accounts",
  req.session.oauthAccessToken,
  req.session.oauthAccessTokenSecret,
  function (error, data, response) {
      var parsedData = JSON.parse(data);
      res.status(200).send(html)
  });
});



app.post('/createTransactionRequest', urlencodedParser, function(req, res){
  
  var template = "./template/createTransactionRequest.pug";
  
  


  if (!req.body) return res.sendStatus(400)
  
  var fromBankId = req.body.from_bank_id;
  var fromAccountId = req.body.from_account_id;

  var toBankId = req.body.to_bank_id;
  var toAccountId = req.body.to_account_id;

  var currency = req.body.currency;
  var amount = req.body.amount;

  var description = req.body.description;


  var transactionRequestType = req.body.transaction_request_type;
  if (transactionRequestType == ""){
    transactionRequestType = "SANDBOX_TAN";
  }


  // Build the body that we will post
  var toObj = {"bank_id": toBankId, "account_id": toAccountId};
  var valueObj = {"currency":currency, "amount":amount};

  var detailsObj = {"to": toObj, "value": valueObj, "description": description}

  var details = JSON.stringify(detailsObj)

  console.log("detailsObj is: " + details);



  var viewId = "owner"  

  var apiHost = config.apiHost

  var postUrl = apiHost + "/obp/v2.1.0/banks/" + fromBankId + "/accounts/" + fromAccountId + "/" + viewId + "/transaction-request-types/" + transactionRequestType + "/transaction-requests";

  console.log("postUrl is " + postUrl);


  

  consumer.post(postUrl,
  req.session.oauthAccessToken,
  req.session.oauthAccessTokenSecret,
  details,
  "application/json",
  function (error, data, response) {

      var error = JSON.stringify(error)

      console.log("error is: " + error)
      console.log("data is: " + data)
      console.log("response is: " + response)


        try {
          var parsedData = JSON.parse(data);
          console.log("parsedData is: " + parsedData)
          message = "Parsed JSON OK"
        } catch (err) {
            // handle the error safely
            console.log(err)
            message = "Something went wrong creating a transaction request - did you supply the correct values?"
        }

      var options = {"error": error,
                     "postUrl" : postUrl, 
                     "fromBankId": fromBankId,
                     "fromAccountId": fromAccountId,
                     "toBankId": toBankId,
                     "toAccountId" : toAccountId,
                     "currency" : currency,
                     "transactionRequestType" : transactionRequestType,
                     "details": details,
                     "data": data};   

      var html = pug.renderFile(template, options) 

      res.status(200).send(html)
  });
});






app.get('*', function(req, res){
  res.redirect('/connect');
});

app.listen(8085);

