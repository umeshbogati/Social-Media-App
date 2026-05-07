import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendError } from "../utils/errorhandler";
import { HTTP_STATUS } from "../constants";
// Validation Middleware
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        error.errors?.[0]?.message || "Validation error",
      );
    }
  };