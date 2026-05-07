import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/errorhandler";
import { HTTP_STATUS } from "../constants";

// Middleware to validate route parameters

type ParamKey = "id" | "postId" | "userId";

export const validateParam =
  (key: ParamKey) =>
  (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[key];

    if (!value || Array.isArray(value)) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        `Invalid or missing ${key}`,
      );
    }

    next();
  };