import assert from "node:assert/strict";
import mongoose from "mongoose";
import test from "node:test";

import {
  applyJob,
  getJobById,
  toggleSaveJob,
  updateApplicationStatus,
} from "../controllers/jobController.js";
import Jobs from "../models/jobsModel.js";
import Companies from "../models/companiesModel.js";
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

const createObjectId = () => new mongoose.Types.ObjectId().toString();

test("getJobById returns a standard 404 for invalid ids", async () => {
  const res = createResponse();

  await getJobById({ params: { id: "not-a-valid-id" } }, res);

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, {
    success: false,
    status: "failed",
    message: "İş ilanı bulunamadı.",
  });
});

test("getJobById returns job details with similar jobs", async (t) => {
  const jobId = createObjectId();
  const job = {
    _id: jobId,
    jobTitle: "Frontend Developer",
    jobType: "Full-Time",
  };
  const similarJobs = [{ _id: createObjectId(), jobTitle: "Frontend Engineer" }];

  t.mock.method(Jobs, "findById", () => ({
    populate: async () => job,
  }));
  t.mock.method(Jobs, "find", () => ({
    populate() {
      return this;
    },
    sort() {
      return this;
    },
    limit: async () => similarJobs,
  }));

  const res = createResponse();

  await getJobById({ params: { id: jobId } }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data, job);
  assert.equal(res.body.similarJobs, similarJobs);
});

test("applyJob appends applicant and pending status", async (t) => {
  const jobId = createObjectId();
  const userId = createObjectId();
  const companyId = createObjectId();
  let saved = false;
  let findByIdCalls = 0;
  const job = {
    _id: jobId,
    company: companyId,
    application: [],
    applicationStatus: [],
    async save() {
      saved = true;
    },
  };
  const updatedJob = { _id: jobId, application: [userId] };

  t.mock.method(Jobs, "findById", () => {
    findByIdCalls += 1;

    if (findByIdCalls === 1) {
      return Promise.resolve(job);
    }

    return {
      populate: async () => updatedJob,
    };
  });
  t.mock.method(Users, "findById", async () => ({ _id: userId }));

  const res = createResponse();

  await applyJob(
    {
      params: { id: jobId },
      body: { user: { userId } },
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(saved, true);
  assert.deepEqual(job.application, [userId]);
  assert.equal(job.applicationStatus.length, 1);
  assert.equal(job.applicationStatus[0].applicant, userId);
  assert.equal(job.applicationStatus[0].status, "pending");
  assert.equal(res.body.data, updatedJob);
});

test("applyJob rejects duplicate applications", async (t) => {
  const jobId = createObjectId();
  const userId = createObjectId();
  const companyId = createObjectId();
  const job = {
    _id: jobId,
    company: companyId,
    application: [userId],
    applicationStatus: [],
  };

  t.mock.method(Jobs, "findById", async () => job);
  t.mock.method(Users, "findById", async () => ({ _id: userId }));

  const res = createResponse();

  await applyJob(
    {
      params: { id: jobId },
      body: { user: { userId } },
    },
    res
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: "Bu ilana zaten başvurdun.",
  });
});

test("toggleSaveJob saves and unsaves a job for a seeker", async (t) => {
  const jobId = createObjectId();
  const userId = createObjectId();
  let saveCalls = 0;
  const applicant = {
    _id: userId,
    savedJobs: [],
    async save(options) {
      saveCalls += 1;
      this.lastSaveOptions = options;
    },
  };

  t.mock.method(Jobs, "findById", async () => ({ _id: jobId }));
  t.mock.method(Users, "findById", async () => applicant);

  const saveResponse = createResponse();

  await toggleSaveJob(
    {
      params: { id: jobId },
      body: { user: { userId } },
    },
    saveResponse
  );

  assert.equal(saveResponse.statusCode, 200);
  assert.equal(saveResponse.body.saved, true);
  assert.deepEqual(applicant.savedJobs, [jobId]);

  const unsaveResponse = createResponse();

  await toggleSaveJob(
    {
      params: { id: jobId },
      body: { user: { userId } },
    },
    unsaveResponse
  );

  assert.equal(unsaveResponse.statusCode, 200);
  assert.equal(unsaveResponse.body.saved, false);
  assert.deepEqual(applicant.savedJobs, []);
  assert.equal(saveCalls, 2);
  assert.deepEqual(applicant.lastSaveOptions, { validateBeforeSave: false });
});

test("updateApplicationStatus rejects invalid status values", async () => {
  const res = createResponse();

  await updateApplicationStatus(
    {
      params: { jobId: createObjectId(), applicantId: createObjectId() },
      body: {
        status: "maybe",
        user: { userId: createObjectId() },
      },
    },
    res
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: "Geçersiz başvuru durumu.",
  });
});

test("updateApplicationStatus requires the owning company", async (t) => {
  const jobId = createObjectId();
  const applicantId = createObjectId();
  const owningCompanyId = createObjectId();
  const otherCompanyId = createObjectId();

  t.mock.method(Jobs, "findById", async () => ({
    _id: jobId,
    company: owningCompanyId,
  }));

  const res = createResponse();

  await updateApplicationStatus(
    {
      params: { jobId, applicantId },
      body: {
        status: "reviewed",
        user: { userId: otherCompanyId },
      },
    },
    res
  );

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, {
    success: false,
    message: "Başvuru durumunu yalnızca ilan sahibi şirket güncelleyebilir.",
  });
});

test("updateApplicationStatus updates existing status entries", async (t) => {
  const jobId = createObjectId();
  const applicantId = createObjectId();
  const companyId = createObjectId();
  let saved = false;
  const job = {
    _id: jobId,
    jobTitle: "Frontend Developer",
    company: companyId,
    application: [applicantId],
    applicationStatus: [
      {
        applicant: applicantId,
        status: "pending",
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    ],
    async save() {
      saved = true;
    },
  };

  t.mock.method(Jobs, "findById", async () => job);
  t.mock.method(Users, "findById", () => ({
    select: async () => ({ firstName: "Eda" }),
  }));
  t.mock.method(Companies, "findById", () => ({
    select: async () => ({ name: "KariyerBul" }),
  }));

  const res = createResponse();

  await updateApplicationStatus(
    {
      params: { jobId, applicantId },
      body: {
        status: "accepted",
        user: { userId: companyId },
      },
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(saved, true);
  assert.equal(job.applicationStatus[0].status, "accepted");
  assert.equal(res.body.success, true);
  assert.deepEqual(res.body.data, {
    jobId,
    applicantId,
    status: "accepted",
  });
});
