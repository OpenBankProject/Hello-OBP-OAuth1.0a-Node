import { Controller, Req, Res, Get } from "routing-controllers";
import { Request, Response } from "express";
import { Service } from "typedi";

@Controller()
@Service()
export default class CustomerController {
  @Get("/customer")
  getCustomer(@Req() request: Request, @Res() response: Response): Response {
    return response.json("Customer list.");
  }
}
