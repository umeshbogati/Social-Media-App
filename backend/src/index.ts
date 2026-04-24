import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./utils/logger";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// DB
connectDB().catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => console.log("Server running  on port 5000"));
