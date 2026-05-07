import { sendError } from "./errorhandler";
import { HTTP_STATUS } from "../constants";
import { Response } from "express";

// Utility to validate and extract ID from request parameters

export const getParamId = (id: any, res?: Response): string | null => {
  if (!id || Array.isArray(id)) {
    if (res) {
      sendError(res, HTTP_STATUS.BAD_REQUEST, "Invalid or missing id");
    }
    return null;
  }

  return id;
};