// Open Bank Project

// Copyright 2011,2014 TESOBE / Music Pictures Ltd.

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
// Copyright 2011,2014 TESOBE / Music Pictures Ltd

// This product includes software developed at
// TESOBE (http://www.tesobe.com/)
// by
// TESOBE: contact AT tesobe DOT com
// Nina Gänsdorfer: nina AT tesobe DOT com

var express = require('express');
var util = require('util');
var oauth = require('oauth');
 
var app = express();
 

// To get the values for the following fields, please register your client here: 
// https://apisandbox.openbankproject.com/consumer-registration
var _openbankConsumerKey = "yourOpenBankConsumerKey";
var _openbankConsumerSecret = "yourOpenBankConsumerSecret";
 
var consumer = new oauth.OAuth(
  'https://apisandbox.openbankproject.com/oauth/initiate',
  'https://apisandbox.openbankproject.com/oauth/token',
  _openbankConsumerKey,
  _openbankConsumerSecret,
  '1.0', 
  'http://127.0.0.1:8080/callback', 
  'HMAC-SHA1');
 
app.configure(function(){
	app.use(express.cookieParser());
	app.use(express.session({ secret: "very secret" }));
});


app.get('/connect', function(req, res){
	consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
		if (error) {
			res.send("Error getting OAuth request token : " + util.inspect(error), 500);
		} else {
			req.session.oauthRequestToken = oauthToken;
			req.session.oauthRequestTokenSecret = oauthTokenSecret;
			res.redirect("https://apisandbox.openbankproject.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
		}
	});
});


app.get('/callback', function(req, res){
	consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
		if (error) {
			res.send("Error getting OAuth access token : " + util.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+util.inspect(results)+"]", 500);
		} else {
			req.session.oauthAccessToken = oauthAccessToken;
			req.session.oauthAccessTokenSecret = oauthAccessTokenSecret; 
			res.redirect('/signed_in');
		}
	});
});


app.get('/signed_in', function(req, res){
	res.send('Signing in by OAuth worked. Now you can do API calls on private data like this one: <br><a href="/getBanks">Get private banks</a>')
});

app.get('/getBanks', function(req, res){
	consumer.get("https://apisandbox.openbankproject.com/obp/v1.2/banks/rbs/accounts/private", oauthAccessToken, oauthAccessTokenSecret, function (error, data, response) {
		var parsedData = JSON.parse(data);
		res.send(parsedData)
	});
});


app.get('*', function(req, res){
	res.redirect('/connect');
});
 
app.listen(8080);