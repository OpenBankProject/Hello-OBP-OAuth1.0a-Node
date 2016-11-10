Hello-OBP-OAuth1.0a-Node
========================

This is a very basic app to demonstrate the integration
of the OpenBankProject with OAuth1.0-Authentication
into a Node.js application.


## SETUP

- Get consumer key & secret:
  - Register your client at https://apisandbox.openbankproject.com/consumer-registration
  - Use the credentials as `_openbankConsumerKey` and `_openbankConsumerSecret` in `oauth.js`
- Install Dependencies:
  ```
  npm install
  ```

- Start Server:
  ```
  node oauth.js
  ```

- Navigate to the page:  
  [http://127.0.0.1:8080](http://127.0.0.1:8080)  
  (not http://localhost:8080 in this example as the session won't be set)
- You can log in as a test user, using the following credentials:
  - username: `joe.bloggs@example.com`
  - password: `qwerty`


## REFERENCES

- [ciaranj/node-oauth: OAuth wrapper for Node.js](https://github.com/ciaranj/node-oauth)
- [Node.js OAuth1.0 and OAuth2.0: Twitter API v1.1 Examples](http://webapplog.com/node-js-oauth1-0-and-oauth2-0-twitter-api-v1-1-examples/)
- [How To Use OAuth and Twitter in your Node.js / ExpressJS App](http://moonlitscript.com/post.cfm/how-to-use-oauth-and-twitter-in-your-node-js-expressjs-app/)
- [Twitter OAuth with node-oauth for Node.js+Express](https://gist.github.com/joshj/1933640)
