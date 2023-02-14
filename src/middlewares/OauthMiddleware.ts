import { ExpressMiddlewareInterface } from "routing-controllers";
import { Response, Request } from "express";
import { Service } from "typedi";
import OauthInjectedService from "../services/OauthInjectedService";

@Service()
export default class OauthMiddleware implements ExpressMiddlewareInterface {
  constructor(private oauthInjectedService: OauthInjectedService) {}

  use(request: Request, response: Response): any {
    const session: any = request.session;
    const apiHost = process.env.API_HOST;
    const consumer = this.oauthInjectedService.getConsumer();
    consumer.getOAuthRequestToken(function (
      error,
      oauthToken,
      oauthTokenSecret
    ) {
      if (error) {
        console.error(error);
      } else {
        session.oauthRequestToken = oauthToken;
        session.oauthRequestTokenSecret = oauthTokenSecret;
        response.redirect(
          apiHost + "/oauth/authorize?oauth_token=" + oauthToken
        );
      }
    });
  }
}
