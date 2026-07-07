import express, { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  getCompanies,
  getCompanyApplications,
  getCompanyById,
  getCompanyJobListing,
  getCompanyProfile,
  forgotCompanyPassword,
  register,
  resetCompanyPassword,
  signIn,
  updateCompanyProfile,
} from "../controllers/companiesController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

//ip rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
});

// REGISTER
router.post("/register", limiter, register);

// LOGIN
router.post("/login", limiter, signIn);
router.post("/forgot-password", limiter, forgotCompanyPassword);
router.post("/reset-password", limiter, resetCompanyPassword);

// GET DATA
router.post("/get-company-profile", userAuth, getCompanyProfile);
router.post("/get-company-joblisting", userAuth, getCompanyJobListing);
router.get("/applications", userAuth, getCompanyApplications);
router.get("/", getCompanies);
router.get("/get-company/:id", getCompanyById);

// UPDATE DATA
router.put("/update-company", userAuth, updateCompanyProfile);

export default router;
