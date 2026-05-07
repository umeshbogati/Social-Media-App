import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

import { AuthService } from "../services/authService";

import {
  sendSuccess,
  sendError,
} from "../utils/errorhandler";

import { HTTP_STATUS } from "../constants";

import {
  registerSchema,
  loginSchema,
} from "../schemas/zodSchema";

import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
} from "../config/env";

// Register Controller
export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const { user, accessToken, refreshToken } =
      await AuthService.register(data);

    return sendSuccess(res, {
      user,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.errors?.[0]?.message || error.message
    );
  }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await AuthService.login(data);

    return sendSuccess(res, result);
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message || "Login failed"
    );
  }
};

// Get Current User Controller
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return sendError(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Unauthorized"
      );
    }

    return sendSuccess(res, { user });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

// Refresh Token Controller
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token =
      req.body.refreshToken ||
      req.cookies?.refreshToken;

    if (!token) {
      return sendError(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "No refresh token provided"
      );
    }

    const decoded = jwt.verify(
      token,
      JWT_REFRESH_SECRET
    ) as jwt.JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return sendError(
        res,
        HTTP_STATUS.FORBIDDEN,
        "Invalid refresh token"
      );
    }

    const newAccessToken = jwt.sign(
      { id: user._id.toString() },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    return sendSuccess(res, {
      accessToken: newAccessToken,
    });
  } catch {
    return sendError(
      res,
      HTTP_STATUS.FORBIDDEN,
      "Invalid or expired refresh token"
    );
  }
};

// Logout Controller
export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return sendError(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Unauthorized"
      );
    }

    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
    });

    return sendSuccess(res, {
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};