import { AuthService } from "../services/authService";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

import {
  sendSuccess,
  sendError,
  handleAuthError,
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

/* ================= REGISTER ================= */
export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const {
      user,
      accessToken,
      refreshToken,
    } = await AuthService.register(data);

    return sendSuccess(res, {
      user,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.errors?.[0]?.message || error.message,
    );
  }
};

/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  try {
    console.log("LOGIN BODY:", req.body); // 🔥 debug

    const data = loginSchema.parse(req.body);

    const result = await AuthService.login(data);

    return sendSuccess(res, result);
  } catch (error: any) {
    console.error("❌ LOGIN ERROR:", error); // 🔥 REAL ERROR

    return res.status(500).json({
      message: error.message || "Login failed",
      stack: error.stack,
    });
  }
};

/* ================= GET ME ================= */
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return sendError(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Unauthorized",
      );
    }

    return sendSuccess(res, { user });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};

/* ================= REFRESH TOKEN ================= */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.body.refreshToken;

    if (!token) {
      return sendError(res, 401, "No refresh token");
    }

    const decoded = jwt.verify(
      token,
      JWT_REFRESH_SECRET
    ) as jwt.JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return sendError(res, 403, "Invalid refresh token");
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
    return sendError(res, 403, "Invalid or expired refresh token");
  }
};
/* ================= LOGOUT ================= */
export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return sendError(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "Unauthorized",
      );
    }

    const user = await User.findById(userId);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return sendSuccess(res, {
      message: "Logged out successfully",
    });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};