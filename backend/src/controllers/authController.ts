import { AuthService } from "../services/authService";
import { validateRegister, validateLogin } from "../schemas/validation";
import { Request, Response } from "express";
import {
  sendSuccess,
  sendError,
  handleAuthError,
  handleValidationError,
} from "../utils/errorhandler";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants";

// Signup
export const register = async (req: Request, res: Response) => {
  try {
    // Check if request body exists
    if (!req.body) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.REQUEST_BODY_REQUIRED,
      );
    }

    const errors = validateRegister(req.body);
    if (errors.length > 0) {
      return handleValidationError(res, errors);
    }

    const user = await AuthService.register(req.body);
    const { password, ...userData } = user;
    return sendSuccess(res, userData);
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message);
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    // Check if request body exists
    if (!req.body) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.REQUEST_BODY_REQUIRED,
      );
    }
    const errors = validateLogin(req.body);
    if (errors.length > 0) {
      return handleValidationError(res, errors);
    }

    const result = await AuthService.login(req.body);
    return sendSuccess(res, result);
  } catch (error: any) {
    return handleAuthError(res, error);
  }
};
