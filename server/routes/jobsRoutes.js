import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  applyJob,
  createJob,
  deleteJobPost,
  getJobById,
  getJobPosts,
  getMyApplications,
  updateApplicationStatus,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

// POST JOB
router.post("/upload-job", userAuth, createJob);

// IPDATE JOB
router.put("/update-job/:jobId", userAuth, updateJob);

// GET JOB POST
router.get("/find-jobs", getJobPosts);
router.get("/get-job-detail/:id", getJobById);
router.get("/my-applications", userAuth, getMyApplications);

// APPLY JOB
router.post("/apply-job/:id", userAuth, applyJob);
router.patch(
  "/application-status/:jobId/:applicantId",
  userAuth,
  updateApplicationStatus
);

// DELETE JOB POST
router.delete("/delete-job/:id", userAuth, deleteJobPost);

export default router;
