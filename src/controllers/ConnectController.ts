import { Controller, Req, Res, Get, UseBefore } from "routing-controllers";
import { Request, Response } from "express";
import OauthMiddleware from "../middlewares/OauthMiddleware";
import { Service } from "typedi";

@Controller()
@Service()
@UseBefore(OauthMiddleware)
export class ConnectController {
  @Get("/connect")
  connect(@Req() request: Request, @Res() response: Response): Response {
    return response;
  }
}
