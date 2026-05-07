import express from "express";
import { protect } from "../middleware/authmiddleware";
import { upload } from "../utils/multer";
import {
  updateProfile,
  getProfile,
} from "../controllers/userController";

const router = express.Router();

// GET USER PROFILE
router.get("/me", protect, getProfile);

// UPDATE PROFILE
router.put(
  "/update",
  protect,
  upload.single("image"),
  updateProfile,
);

export default router;