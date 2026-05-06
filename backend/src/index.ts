import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { logger } from "./utils/logger";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server AFTER DB connection
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });