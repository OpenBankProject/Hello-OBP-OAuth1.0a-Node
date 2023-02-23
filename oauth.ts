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

import express from 'express';
import session from 'express-session';
import util from 'util';
import oauth from 'oauth';
const pug = require('pug');

const app = express();

/////////////////////////////////////
// OAuth Config:
// To make authenticated calls to the API, you need OAuth keys 
// To get them, please register your App here:
// https://YOUR-OBP-API-HOST/consumer-registration
// See README.md for an example config.json
// This loads your consumer key and secret from a file you create.
const config = require('./config.json');
//////////////////////////////////////

// Template engine (previously known as Jade)
const _openbankConsumerKey = config.consumerKey;
const _openbankConsumerSecret = config.consumerSecret;
const _openbankRedirectUrl = config.redirectUrl;

const port = 8085

// The location, on the interweb, of the OBP API server we want to use.
const apiHost = config.apiHost;

console.log ("Your apiHost is: " + apiHost)
console.log ("This application is running on http://127.0.0.1:" + port)
console.log ("The redirect URL is: " + _openbankRedirectUrl)

function onException (res: any, exception: any, moreData: any) {
    const template = "./template/oops.pug";
    const title = "Oops, something went wrong."
    const subTitle = "Maybe you are not logged in?"

    console.log('we got an exception:' + exception);
    const options = { title: title, subTitle: subTitle, exception: exception, moreData: moreData};
    const html = pug.renderFile(template, options);
    res.status(500).send(html)
}

// Augment express-session with a custom SessionData object
declare module 'express-session' {
    interface SessionData {
        oauthRequestToken: string;
        oauthRequestTokenSecret: string;
        isLogin: boolean;
        oauthAccessTokenSecret: string;
        oauthAccessToken: string;
    }
}


app.use(session({
  secret: "very secret",
  resave: false,
  saveUninitialized: true
}));


const consumer = new oauth.OAuth(
    apiHost + '/oauth/initiate',
    apiHost + '/oauth/token',
    _openbankConsumerKey,
    _openbankConsumerSecret,
    '1.0',
    _openbankRedirectUrl,
    'HMAC-SHA1');


app.get('/connect', function(req, res){
    consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret){
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
        req.session.oauthRequestToken || "",
        req.session.oauthRequestTokenSecret || "",
        req.query.oauth_verifier as string,
        function(error, oauthAccessToken, oauthAccessTokenSecret) {
            if (error) {
                //oauthAccessToken, -Secret and result are now undefined
                res.status(500).send("Error getting OAuth access token : " + util.inspect(error));
            } else {
                //error is now undefined
                req.session.oauthAccessToken = oauthAccessToken|| "";
                req.session.oauthAccessTokenSecret = oauthAccessTokenSecret|| "";
                req.session.isLogin = true;
                res.redirect('/signed_in');
            }
        }
    );
});


app.get('/signed_in', function(req, res){
    if(!req.session.isLogin){
        req.session.destroy(() => {
            res.redirect('/') // will always fire after session is destroyed
        });
        return res.send('User has not Log in. </br> <a href="/connect">Please Log in First!</a>')
    }

    // res.send(
    //     '<a href="/getCurrentUser">get Current User</a> <br><br><br>' +
    //     '<a href="/getMyAllAccounts">get My Account Accounts</a> <br><br><br>' +
    //     '<a href="/api/logout">Log Out</a>')
    const template = "./template/signedIn.pug"
    const options = {}
    const html = pug.renderFile(template, options)
    res.status(200).send(html)

});

app.get('/getCurrentUser', function(req, res){
    consumer.get(apiHost + "/obp/v3.1.0/users/current",
        req.session.oauthAccessToken  || "" ,
        req.session.oauthAccessTokenSecret  || "" ,
        function (error, data) {
            try {
                const parsedData = JSON.parse(data as string);
                res.status(200).send(parsedData)
            } catch (exception){
                res.status(500).send(exception)
            }});
});

app.get('/getMyAccountsJson', function(req, res){
    consumer.get(apiHost + "/obp/v3.0.0/my/accounts",
        req.session.oauthAccessToken as string,
        req.session.oauthAccessTokenSecret as string,
        function (error, data, response) {
            try {
                const parsedData = JSON.parse(data as string,);
                res.status(200).send(parsedData)
            } catch (exception){
                onException(res, exception, data);
            }
        });
});

app.get('/getMyAccounts', function(req, res){

    const template = "./template/accounts.pug";
    const title = "Accounts"

    consumer.get(apiHost + "/obp/v3.0.0/my/accounts",
        req.session.oauthAccessToken as string,
        req.session.oauthAccessTokenSecret as string,
        // When the GET request completes, we call the following function with the data we got back:
        function (error, data, response) {
            //console.log("error is: " + error);
            //console.log("data is: " + data);
            //console.log("response is: " + response);

            try {
                const json = JSON.parse(data as string);
                //console.log("json is: " + util.inspect(json, false, null))
                const options = { title: title, error: error, json : json, response: response};
                const html = pug.renderFile(template, options);
                res.status(200).send(html)
            } catch (exception) {
                onException(res, exception, data);
            }
        });
});




app.get('/createTransactionRequest', function(req, res){


    const template = "./template/createTransactionRequest.pug";
    const options = { transactionRequestType :"SANDBOX_TAN"};
    const html = pug.renderFile(template, options);


    consumer.get(apiHost + "/obp/v3.0.0/my/accounts",
        req.session.oauthAccessToken as string,
        req.session.oauthAccessTokenSecret as string,
        function (error, data) {
            res.status(200).send(html)
        });
});



app.post('/createTransactionRequest', function(req, res){

    const template = "./template/createTransactionRequest.pug";

    if (!req.body) return res.sendStatus(400)

    const fromBankId = req.body.from_bank_id;
    const fromAccountId = req.body.from_account_id;

    const toBankId = req.body.to_bank_id;
    const toAccountId = req.body.to_account_id;

    const currency = req.body.currency;
    const amount = req.body.amount;

    const description = req.body.description;


    let transactionRequestType = req.body.transaction_request_type;

    console.log("transactionRequestType is: " + transactionRequestType);


    if (transactionRequestType.length == 0){
        transactionRequestType = "SANDBOX_TAN";
    }


    // Build the body that we will post
    const toObj = {"bank_id": toBankId, "account_id": toAccountId};
    const valueObj = {"currency":currency, "amount":amount};

    const detailsObj = {"to": toObj, "value": valueObj, "description": description}

    const details = JSON.stringify(detailsObj)

    console.log("details is: " + details);


    const viewId = "owner"

    const apiHost = config.apiHost

    const postUrl = apiHost + "/obp/v3.1.0/banks/" + fromBankId + "/accounts/" + fromAccountId + "/" + viewId + "/transaction-request-types/" + transactionRequestType + "/transaction-requests";

    console.log("postUrl is " + postUrl);

    consumer.post(postUrl,
        req.session.oauthAccessToken as string,
        req.session.oauthAccessTokenSecret as string,
        details, // This is the body of the request
        "application/json", // Must specify this else will get 404
        function (error, data, response) {

            const error1 = JSON.stringify(error)

            console.log("error1 is: " + error1)
            console.log("data is: " + data)
            console.log("response is: " + response)


            try {
                const parsedData = JSON.parse(data as string);
                console.log("parsedData is: " + parsedData)
            } catch (err) {
                // handle the error1 safely
                console.log(err)
            }

            const options = {"error": error1,
                "postUrl" : postUrl,
                "fromBankId": fromBankId,
                "fromAccountId": fromAccountId,
                "toBankId": toBankId,
                "toAccountId" : toAccountId,
                "currency" : currency,
                "transactionRequestType" : transactionRequestType,
                "details": details,
                "data": data};

            const html = pug.renderFile(template, options)

            res.status(200).send(html)
        });
});


app.post('/api/logout', (req, res) =>{
    if(!req.session.isLogin){
        return res.send({status: 1, msg: 'user has not login yet.'})
    }
    req.session.destroy(() => {
        res.redirect('/') // will always fire after session is destroyed
    })

    res.send({status: 0, msg: 'log out successfully.'})
})



app.get('*', function(req, res){
    res.send(
        '<a href="/connect">Please Log in First!</a>')
});


app.listen(port, () => {});
