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


// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var _openbankConsumerKey = config.consumerKey;
var _openbankConsumerSecret = config.consumerSecret;


// The location, on the interweb, of the OBP API server we want to use.
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
  res.status(200).send('Signing in by OAuth worked. Now you can do API calls on private data like this: <br><a href="/getMyAccounts">Get My Accounts</a> <br><a href="/getCurrentUser">Get Current User</a> <br><a href="/createTransactionRequest">Create Transaction Request (make payment)</a> <br> <a href="/loadCustomers">Load Customers (this is an admin utility function) </a> <br>  <br> Please see the <a href="https://apiexplorersandbox.openbankproject.com">API Explorer</a> for the full list of API calls available.')
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
  var options = { transactionRequestType :"SANDBOX_TAN"}; 
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

  console.log("transactionRequestType is: " + transactionRequestType);


  if (transactionRequestType.length == 0){
    transactionRequestType = "SANDBOX_TAN";
  }


  // Build the body that we will post
  var toObj = {"bank_id": toBankId, "account_id": toAccountId};
  var valueObj = {"currency":currency, "amount":amount};

  var detailsObj = {"to": toObj, "value": valueObj, "description": description}

  var details = JSON.stringify(detailsObj)

  console.log("details is: " + details);


  var viewId = "owner"  

  var apiHost = config.apiHost

  var postUrl = apiHost + "/obp/v2.1.0/banks/" + fromBankId + "/accounts/" + fromAccountId + "/" + viewId + "/transaction-request-types/" + transactionRequestType + "/transaction-requests";

  console.log("postUrl is " + postUrl);

  consumer.post(postUrl,
  req.session.oauthAccessToken,
  req.session.oauthAccessTokenSecret,
  details, // This is the body of the request
  "application/json", // Must specify this else will get 404
  function (error, data, response) {

      var error = JSON.stringify(error)

      console.log("error is: " + error)
      console.log("data is: " + data)
      console.log("response is: " + response)


        try {
          var parsedData = JSON.parse(data);
          console.log("parsedData is: " + parsedData)
          message = ""
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

// WORK IN PROGRESS
app.get('/loadCustomers', function(req, res){
  

  var template = "./template/loadCustomers.pug";


  var customers = require('/Users/simonredfern/Documents/OpenBankProject/DATA/korea/OBP_sandbox_customers_pretty.json');


  console.log('before customer loop. There are ' + customers.length + ' customers.')

  for(var i = 0; i < customers.length; i++) {

    console.log('i is : ' + i);

      var customer = customers[i];
      var usersByEmailUrl = apiHost + '/obp/v2.1.0/users/' + customer.email;
      console.log('url to call: ' + usersByEmailUrl)


      // get user by email
      consumer.get(usersByEmailUrl,
      req.session.oauthAccessToken,
      req.session.oauthAccessTokenSecret,
      function (error, data, response) {
          var usersData = JSON.parse(data);

          console.log('usersData is: ' + JSON.stringify(usersData))

          var userId = usersData.users[0].user_id

          console.log('user_id is: ' + userId)

          var postCustomerUrl = apiHost + '/obp/v2.1.0/banks/' + customer.bank_id;
          console.log('url to call: ' + postCustomerUrl)

          customerToPost = {"user_id" : userId, 
                            "customer_number": customer.customer_number,
                            "legal_name": customer.legal_name,
                            "mobile_phone_number": customer.mobile_phone_number,
                            "email": customer.email,
                            "face_image": customer.face_image,
                            "date_of_birth":customer.date_of_birth,  
                            "relationship_status": customer.relationship_status,
                            "dependants": customer.dependants,  
                            "dob_of_dependants": customer.dob_of_dependants,
                            "highest_education_attained": customer.highest_education_attained,
                            "employment_status": customer.employment_status,
                            "kyc_status": customer.kyc_status,  
                            "last_ok_date": customer.last_ok_date
                          }

          console.log('customerToPost: ' + JSON.stringify(customerToPost))


          consumer.get(postCustomerUrl,
            req.session.oauthAccessToken,
            req.session.oauthAccessTokenSecret,
            function (error, data, response) {
              var parsedData = JSON.parse(data);

              console.log('response from postCustomerUrl: ' + JSON.stringify(parsedData))

          });

              // (function() {
              //   var j = i;

              //   console.log('j is : ' + j);

              //   var obj = customers[j];
              //   var userByEmailUrl = apiHost + '/obp/v2.1.0/users/' + obj.email;
              //   console.log('url to call: ' + userByEmailUrl)

              // });


  


          
      }); // End get user by email






  }

    var options = {"countCustomers": customers.length}; 
    var html = pug.renderFile(template, options);

    res.status(200).send(html)


});



app.get('*', function(req, res){
  res.redirect('/connect');
});

app.listen(8085);

