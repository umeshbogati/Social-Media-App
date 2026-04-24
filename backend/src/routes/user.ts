import express from "express";
import { verifyToken } from "../middleware/authmiddleware";
import { upload } from "../utils/multer";
import { uploadProfilePicture } from "../controllers/userController";

const router = express.Router();

router.put("/profile", verifyToken, upload.single("image"), uploadProfilePicture);

export default router;