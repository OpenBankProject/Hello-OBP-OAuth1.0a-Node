Hello-OBP-OAuth1.0a-Node
========================

This is a very basic app to demonstrate the integration of the OpenBankProject with OAuth1.0-Authentication
into a NodeJS application.

## SETUP

Get consumer key / secret:
register your client at https://apisandbox.openbankproject.com/consumer-registration
and add the host, key and secret in your config.json file like so:


	config.json
	
    {
    "apiHost": "https://apisandbox.openbankproject.com PLEASE CHANGE THIS TO THE HOST YOU ARE USING!!", 
    "consumerKey": "YOUR CONSUMER KEY GOES HERE",
    "consumerSecret" : "YOUR CONSUMER SECRET GOES HERE"
    "redirectUrl": "http://127.0.0.1:8085/callback"
    }




Install Dependencies:
npm install

Start Server:
node oauth.js

Navigate to the page:
http://127.0.0.1:8085
(not http://localhost:8085 in this example as the session won't be set)

You can log in as a test user, using the following credentials on the general OBP API sandbox:

username: joe.bloggs@example.com
password: qwerty

Each public sandbox generally has a github wiki page with dummy customer logins. See the home page of the API sandbox you are using.

## REFERENCES

[https://github.com/ciaranj/node-oauth](https://github.com/ciaranj/node-oauth)
[http://webapplog.com/node-js-oauth1-0-and-oauth2-0-twitter-api-v1-1-examples/](http://webapplog.com/node-js-oauth1-0-and-oauth2-0-twitter-api-v1-1-examples/)
[http://moonlitscript.com/post.cfm/how-to-use-oauth-and-twitter-in-your-node-js-expressjs-app/](http://moonlitscript.com/post.cfm/how-to-use-oauth-and-twitter-in-your-node-js-expressjs-app/)
[https://gist.github.com/joshj/1933640](https://gist.github.com/joshj/1933640)
