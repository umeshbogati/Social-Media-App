import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import { AnyARecord } from "node:dns";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "social-media-app",
        allowed_formats: ["jpg", "jpeg", "png"]
    } as any
});

export const upload = multer({ storage });