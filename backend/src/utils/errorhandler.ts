import { Response } from "express";

// SUCCESS

export const sendSuccess = (
  res: Response,
  data: any,
  status = 200,
  message = "Success"
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

// ERROR

export const sendError = (
  res: Response,
  status = 500,
  message = "Something went wrong",
  error?: any
) => {
  return res.status(status).json({
    success: false,
    message,
    error: error || null,
  });
};

// POST ERROR HANDLER
export const handlePostError = (res: Response, error: any) => {
  console.error("POST ERROR:", error);

  if (error.message === "Post not found") {
    return res.status(404).json({ message: error.message });
  }

  if (error.message === "Not authorized") {
    return res.status(403).json({ message: error.message });
  }

  return res.status(500).json({
    message: "Server Error",
    error: error.message,
  });
};