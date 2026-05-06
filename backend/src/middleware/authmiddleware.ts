import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/env";
import { sendError } from "../utils/errorhandler";
import { HTTP_STATUS } from "../constants";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Token missing");
    }

    if (!JWT_SECRET) {
      return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, "JWT secret missing");
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = {
      id: (decoded as any).id,
      role: (decoded as any).role,
    };

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Token expired");
    }

    return sendError(res, HTTP_STATUS.FORBIDDEN, "Invalid token");
  }
};