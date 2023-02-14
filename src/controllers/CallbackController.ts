import { Controller, Get, Redirect } from "routing-controllers";
import { Service } from "typedi";
import OauthInjectedService from "../services/OauthInjectedService";

@Controller()
@Service()
export default class CallbackController {
  constructor(private oauthInjectedService: OauthInjectedService) {}
  @Get("/callback")
  @Redirect("/signed_in")
  callback(): any {
    return;
  }
}
