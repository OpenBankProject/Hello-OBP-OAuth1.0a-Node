import { Controller, Req, Res, Get } from "routing-controllers";
import { Request, Response } from "express";
import { Service } from "typedi";

@Controller()
@Service()
export default class SignedInController {
  @Get("/signed_in")
  signedIn(@Req() request: Request, @Res() response: Response): Response {
    return response.json("Singed In");
  }
}
