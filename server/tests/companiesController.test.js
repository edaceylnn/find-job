import assert from "node:assert/strict";
import mongoose from "mongoose";
import test from "node:test";

import {
  getCompanyById,
  getCompanyJobListing,
  register,
  signIn,
} from "../controllers/companiesController.js";
import Companies from "../models/companiesModel.js";
import Jobs from "../models/jobsModel.js";

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

const createObjectId = () => new mongoose.Types.ObjectId().toString();

test("company register validates required fields", async () => {
  let nextValue;

  await register({ body: {} }, createResponse(), (value) => {
    nextValue = value;
  });

  assert.equal(nextValue, "Company Name is required!");
});

test("company register returns conflict through next for duplicate email", async (t) => {
  t.mock.method(Companies, "findOne", async () => ({ _id: "company-1" }));
  let nextValue;

  await register(
    {
      body: {
        name: "KariyerBul",
        email: "company@example.com",
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
    message: "Email Already Registered. Please Login",
  });
});

test("company signIn returns token when credentials match", async (t) => {
  const company = {
    _id: "company-1",
    name: "KariyerBul",
    email: "company@example.com",
    password: "hashed-password",
    comparePassword: async () => true,
    createJWT: () => "company-token",
  };

  t.mock.method(Companies, "findOne", () => ({
    select: async () => company,
  }));

  const res = createResponse();

  await signIn(
    {
      body: {
        email: "company@example.com",
        password: "secret123",
      },
    },
    res,
    () => {}
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.token, "company-token");
  assert.equal(res.body.user.password, undefined);
});

test("getCompanyById returns 404 for invalid ids", async () => {
  const res = createResponse();

  await getCompanyById({ params: { id: "bad-id" } }, res);

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, {
    success: false,
    status: "failed",
    message: "Şirket bulunamadı.",
  });
});

test("getCompanyJobListing searches and sorts company jobs", async (t) => {
  const companyId = createObjectId();
  const company = {
    _id: companyId,
    name: "KariyerBul",
    toObject() {
      return { _id: companyId, name: "KariyerBul" };
    },
  };
  const jobPosts = [{ _id: createObjectId(), jobTitle: "Frontend Developer" }];
  let receivedJobQuery;
  let receivedSort;

  t.mock.method(Companies, "findById", () => ({
    select: async () => company,
  }));
  t.mock.method(Jobs, "find", (query) => {
    receivedJobQuery = query;

    return {
      sort: async (sort) => {
        receivedSort = sort;
        return jobPosts;
      },
    };
  });

  const res = createResponse();

  await getCompanyJobListing(
    {
      query: { search: "Frontend", sort: "A-Z" },
      body: { user: { userId: companyId } },
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.deepEqual(res.body.companies, {
    _id: companyId,
    name: "KariyerBul",
    jobPosts,
  });
  assert.equal(receivedJobQuery.company, companyId);
  assert.equal(Array.isArray(receivedJobQuery.$or), true);
  assert.equal(receivedJobQuery.$or.length, 3);
  assert.equal(receivedSort, "jobTitle");
});

test("getCompanyJobListing rejects seeker accounts", async (t) => {
  t.mock.method(Companies, "findById", () => ({
    select: async () => null,
  }));
  const res = createResponse();

  await getCompanyJobListing(
    {
      query: {},
      body: { user: { userId: createObjectId() } },
    },
    res
  );

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, {
    success: false,
    status: "failed",
    message: "İlanlarını görüntülemek için şirket hesabı kullanmalısın.",
  });
});
