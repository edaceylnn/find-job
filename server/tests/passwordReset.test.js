import assert from "node:assert/strict";
import test from "node:test";

import { applyPasswordReset } from "../utils/passwordReset.js";

test("applyPasswordReset updates password and clears reset fields", async () => {
  const account = {
    password: "old-password",
    passwordResetToken: "hashed-token",
    passwordResetExpires: Date.now() + 1000,
    saveCalled: false,
    async save() {
      this.saveCalled = true;
    },
  };
  let query;
  const Model = {
    async findOne(receivedQuery) {
      query = receivedQuery;
      return account;
    },
  };

  const result = await applyPasswordReset({
    Model,
    email: "eda@example.com",
    token: "reset-token",
    password: "new-password",
  });

  assert.equal(result, account);
  assert.equal(query.email, "eda@example.com");
  assert.equal(typeof query.passwordResetToken, "string");
  assert.deepEqual(Object.keys(query.passwordResetExpires), ["$gt"]);
  assert.equal(account.password, "new-password");
  assert.equal(account.passwordResetToken, undefined);
  assert.equal(account.passwordResetExpires, undefined);
  assert.equal(account.saveCalled, true);
});

test("applyPasswordReset returns null when token lookup fails", async () => {
  const Model = {
    async findOne() {
      return null;
    },
  };

  const result = await applyPasswordReset({
    Model,
    email: "eda@example.com",
    token: "bad-token",
    password: "new-password",
  });

  assert.equal(result, null);
});
