import express from "express";
import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
} from "../controllers/authController";

import { protect } from "../middleware/authmiddleware";

const router = express.Router();
// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

// PROTECTED ROUTES
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;