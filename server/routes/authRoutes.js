import express from "express";
import { rateLimit } from "express-rate-limit";
import {
  forgotPassword,
  register,
  resetPassword,
  signIn,
} from "../controllers/authController.js";

//ip rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
});

const router = express.Router();

// Register routes
router.post("/register", limiter, register);
router.post("/login", signIn);
router.post("/forgot-password", limiter, forgotPassword);
router.post("/reset-password", limiter, resetPassword);

export default router;
