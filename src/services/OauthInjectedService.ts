import { Service } from "typedi";
import oauth from "oauth";

@Service()
export default class OauthInjectedService {
  private oauth: oauth.OAuth;
  constructor() {
    const apiHost = process.env.API_HOST;
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;
    const redirectUrl = process.env.REDIRECT_URL;
    this.oauth = new oauth.OAuth(
      apiHost + "/oauth/initiate",
      apiHost + "/oauth/token",
      consumerKey,
      consumerSecret,
      "1.0",
      redirectUrl,
      "HMAC-SHA1"
    );
  }

  getConsumer(): oauth.OAuth {
    return this.oauth;
  }
}
