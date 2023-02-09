import { describe, test } from "@jest/globals";
import app, { instance } from "../src/app";
import request from "supertest";

describe("CustomerController", function () {
  test("should be able to get the customer data.", async function () {
    await request(app).get("/customer").expect(200);
  });

  afterAll(function () {
    instance.close();
  });
});
