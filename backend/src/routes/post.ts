import express from "express";
import {
  createPost,
  getPosts,
  getMyPosts,
  deletePost,
  editPost,
  likePost,
  commentPost,
} from "../controllers/postController";

import { protect } from "../middleware/authmiddleware";
import { upload } from "../utils/multer";

const router = express.Router();

// PUBLIC ROUTES

// GET ALL POSTS (add pagination later in controller)
router.get("/", getPosts);

// CREATE POST
router.post(
  "/",
  protect,
  upload.single("image"),
  createPost
);

// MY POSTS
router.get("/me", protect, getMyPosts);

// DELETE POST
router.delete("/:id", protect, deletePost);

// EDIT POST
router.put("/:id", protect, editPost);

// LIKE / UNLIKE POST (better REST usage is POST)
router.post("/:id/like", protect, likePost);

// COMMENT POST
router.post("/:id/comment", protect, commentPost);

export default router;