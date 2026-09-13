import assert from "node:assert/strict";
import test from "node:test";

import { createSearchRegex } from "../utils/search.js";

test("createSearchRegex matches Turkish character variants", () => {
  const regex = new RegExp(createSearchRegex("İstanbul"), "i");

  assert.equal(regex.test("Istanbul"), true);
  assert.equal(regex.test("İstanbul"), true);
  assert.equal(regex.test("istanbul"), true);
});

test("createSearchRegex treats whitespace as flexible spacing", () => {
  const regex = new RegExp(createSearchRegex("frontend developer"), "i");

  assert.equal(regex.test("frontend developer"), true);
  assert.equal(regex.test("frontend   developer"), true);
});

test("createSearchRegex escapes regex metacharacters from user input", () => {
  const regex = new RegExp(createSearchRegex("C++"), "i");

  assert.equal(regex.test("C++ developer"), true);
  assert.equal(regex.test("CCC developer"), false);
});
