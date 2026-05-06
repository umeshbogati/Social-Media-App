import { z } from "zod";

/* ================= AUTH ================= */

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* ================= POST ================= */

export const createPostSchema = z.object({
  description: z
    .string()
    .min(1, "Post cannot be empty")
    .max(500, "Post too long"),
});

export const editPostSchema = z.object({
  description: z
    .string()
    .min(1, "Post cannot be empty")
    .max(500)
    .optional(),
});

/* ================= COMMENT ================= */

export const commentSchema = z.object({
  text: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(200, "Comment too long"),
});

/* ================= PROFILE ================= */

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  username: z.string().min(3).optional(),
});