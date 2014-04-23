Hello-OBP-OAuth1.0a-Node
========================

This is a very basic app to demonstrate the integration of the OpenBankProject with OAuth1.0-Authentication into a NodeJS application.

## SETUP

Get consumer key / secret:  
register your client at  
https://apisandbox.openbankproject.com/consumer-registration  
and use the credentials as _openbankConsumerKey/_openbankConsumerSecret in oauth.js  

Install Dependencies:  
npm install express  
npm install oauth  

Start Server:  
node oauth.js  

Navigate to the page:  
Local host: http://127.0.0.1:8080  

## REFERENCES

[http://moonlitscript.com/post.cfm/how-to-use-oauth-and-twitter-in-your-node-js-expressjs-app/](http://moonlitscript.com/post.cfm/how-to-use-oauth-and-twitter-in-your-node-js-expressjs-app/)  
[https://gist.github.com/joshj/1933640](https://gist.github.com/joshj/1933640)