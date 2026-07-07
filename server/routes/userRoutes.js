import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { getUser, getUserById, updateUser } from "../controllers/userController.js";

const router = express.Router();

// GET user
router.post("/get-user", userAuth, getUser);
router.get("/get-user/:id", userAuth, getUserById);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);

export default router;
