import assert from "node:assert/strict";
import test from "node:test";

import {
  register,
  resetPassword,
  signIn,
} from "../controllers/authController.js";
import Users from "../models/userModel.js";

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
    send(payload) {
      this.body = payload;
      return this;
    },
  };

  return response;
};

test("register validates required seeker fields", async () => {
  let nextValue;

  await register({ body: {} }, createResponse(), (value) => {
    nextValue = value;
  });

  assert.equal(nextValue, "First Name is required");
});

test("register returns a conflict through next when email already exists", async (t) => {
  t.mock.method(Users, "findOne", async () => ({ _id: "existing-user" }));
  let nextValue;

  await register(
    {
      body: {
        firstName: "Eda",
        lastName: "Ceylan",
        email: "eda@example.com",
        password: "secret123",
      },
    },
    createResponse(),
    (value) => {
      nextValue = value;
    }
  );

  assert.deepEqual(nextValue, {
    statusCode: 409,
    message: "Email Address already exists",
  });
});

test("register creates a seeker account response without password", async (t) => {
  const createdUser = {
    _id: "user-1",
    firstName: "Eda",
    lastName: "Ceylan",
    email: "eda@example.com",
    accountType: "seeker",
    createJWT: async () => "token-123",
  };

  t.mock.method(Users, "findOne", async () => null);
  t.mock.method(Users, "create", async () => createdUser);

  const res = createResponse();

  await register(
    {
      body: {
        firstName: "Eda",
        lastName: "Ceylan",
        email: "eda@example.com",
        password: "secret123",
      },
    },
    res,
    () => {}
  );

  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, {
    success: true,
    message: "Account created successfully",
    user: {
      _id: "user-1",
      firstName: "Eda",
      lastName: "Ceylan",
      email: "eda@example.com",
      accountType: "seeker",
    },
    token: "token-123",
  });
});

test("signIn returns token when credentials match", async (t) => {
  const user = {
    _id: "user-1",
    email: "eda@example.com",
    password: "hashed-password",
    comparePassword: async () => true,
    createJWT: () => "token-123",
  };

  t.mock.method(Users, "findOne", () => ({
    select: async () => user,
  }));

  const res = createResponse();

  await signIn(
    {
      body: {
        email: "eda@example.com",
        password: "secret123",
      },
    },
    res,
    () => {}
  );

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.token, "token-123");
  assert.equal(res.body.user.password, undefined);
});

test("resetPassword rejects invalid or expired reset tokens", async (t) => {
  t.mock.method(Users, "findOne", async () => null);
  const res = createResponse();

  await resetPassword(
    {
      body: {
        email: "eda@example.com",
        token: "bad-token",
        password: "new-secret",
      },
    },
    res,
    () => {}
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: "Sıfırlama kodu geçersiz veya süresi dolmuş.",
  });
});
