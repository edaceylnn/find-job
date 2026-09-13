import assert from "node:assert/strict";
import test from "node:test";

import errorMiddleware from "../middlewares/errorMiddleware.js";

const createResponse = () => {
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  return response;
};

test("errorMiddleware formats validation strings as failed bad requests", () => {
  const res = createResponse();

  errorMiddleware("Email is required", {}, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    status: "failed",
    message: "Email is required",
  });
});

test("errorMiddleware respects explicit status codes", () => {
  const res = createResponse();

  errorMiddleware({ statusCode: 409, message: "Email already exists" }, {}, res);

  assert.equal(res.statusCode, 409);
  assert.deepEqual(res.body, {
    success: false,
    status: "failed",
    message: "Email already exists",
  });
});
