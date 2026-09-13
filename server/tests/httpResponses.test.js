import assert from "node:assert/strict";
import test from "node:test";

import { sendNotFound, sendServerError } from "../utils/httpResponses.js";

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

test("sendNotFound returns the standard failed response shape", () => {
  const res = createResponse();

  sendNotFound(res, "Aday bulunamadı.");

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, {
    success: false,
    status: "failed",
    message: "Aday bulunamadı.",
  });
});

test("sendServerError returns a failed server response", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "test";
  const res = createResponse();

  sendServerError(res, new Error("Database failed"), "Profil güncellenemedi.");

  process.env.NODE_ENV = previousNodeEnv;

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    success: false,
    status: "failed",
    message: "Database failed",
  });
});
