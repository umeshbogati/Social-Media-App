import { Response } from "express";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants";

/**
 * Centralized error handler for API responses
 * Usage: sendError(res, HTTP_STATUS.BAD_REQUEST, "User not found")
 */
export const sendError = (
  res: Response,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message: string = ERROR_MESSAGES.SERVER_ERROR,
  details?: any,
) => {
  const response: any = { message };
  if (details) {
    response.details = details;
  }
  return res.status(statusCode).json(response);
};

/**
 * Centralized success handler for API responses
 * Usage: sendSuccess(res, HTTP_STATUS.OK, { user: userData })
 */
export const sendSuccess = (
  res: Response,
  data: any,
  statusCode: number = HTTP_STATUS.OK,
) => {
  return res.status(statusCode).json({ data });
};

/**
 * Handle common auth errors with appropriate status codes
 */
export const handleAuthError = (res: Response, error: any) => {
  if (error.message === ERROR_MESSAGES.USER_NOT_FOUND) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, error.message);
  }
  if (error.message === ERROR_MESSAGES.WRONG_PASSWORD) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
  return sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.SERVER_ERROR,
  );
};

/**
 * Handle common post errors with appropriate status codes
 */
export const handlePostError = (res: Response, error: any) => {
  if (error.message === ERROR_MESSAGES.POST_NOT_FOUND) {
    return sendError(res, HTTP_STATUS.NOT_FOUND, error.message);
  }
  if (error.message === ERROR_MESSAGES.NOT_ALLOWED) {
    return sendError(res, HTTP_STATUS.FORBIDDEN, error.message);
  }
  return sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ERROR_MESSAGES.SERVER_ERROR,
  );
};

/**
 * Handle validation errors
 */
export const handleValidationError = (res: Response, errors: string[]) => {
  return sendError(res, HTTP_STATUS.BAD_REQUEST, "Validation errors", errors);
};
