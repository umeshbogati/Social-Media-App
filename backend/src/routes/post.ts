import express from "express";
import {
  createPost,
  getPosts,
  deletePost,
  editPost,
  likePost,
  commentPost
} from "../controllers/postController";

import { verifyToken } from "../middleware/authmiddleware";
import { upload } from "../utils/multer";

const router = express.Router();

//  CREATE 
router.post("/", verifyToken, upload.single("image"), createPost);

//  GET
router.get("/", getPosts);

//  DELETE
router.delete("/:id", verifyToken, deletePost);

//  EDIT
router.put("/:id", verifyToken, editPost);

//  LIKE
router.put("/:id/like", verifyToken, likePost);

//  COMMENT
router.post("/:id/comment", verifyToken, commentPost);

export default router;