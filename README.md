Hello-OBP-OAuth1.0a-Node
========================

This is a very basic app to demonstrate the integration of the OpenBankProject with OAuth1.0-Authentication
into a NodeJS application.

## SETUP

Get consumer key / secret:
register your client at https://apisandbox.openbankproject.com/consumer-registration
and use the credentials as _openbankConsumerKey/_openbankConsumerSecret in oauth.js

Install Dependencies:
npm install

Start Server:
node oauth.js

Navigate to the page:
http://127.0.0.1:8080
(not http://localhost:8080 in this example as the session won't be set)

You can log in as a test user, using the following credentials:

username: joe.bloggs@example.com
password: qwerty

## REFERENCES

[https://github.com/ciaranj/node-oauth](https://github.com/ciaranj/node-oauth)
[http://webapplog.com/node-js-oauth1-0-and-oauth2-0-twitter-api-v1-1-examples/](http://webapplog.com/node-js-oauth1-0-and-oauth2-0-twitter-api-v1-1-examples/)
[http://moonlitscript.com/post.cfm/how-to-use-oauth-and-twitter-in-your-node-js-expressjs-app/](http://moonlitscript.com/post.cfm/how-to-use-oauth-and-twitter-in-your-node-js-expressjs-app/)
[https://gist.github.com/joshj/1933640](https://gist.github.com/joshj/1933640)
