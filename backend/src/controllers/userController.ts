import { UserService } from "../services/userService";
import { Response } from "express";
import {
  sendSuccess,
  sendError,
} from "../utils/errorhandler";
import { HTTP_STATUS } from "../constants";

import { updateProfileSchema } from "../schemas/zodSchema";
import { AuthRequest } from "../middleware/authmiddleware";

/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // 🔥 Zod validation
    const data = updateProfileSchema.parse(req.body);

    const updateData: any = {
      ...data,
    };

    // ✅ Only update image if provided
    if (req.file?.path) {
      updateData.profilePicture = req.file.path;
    }

    const updatedUser = await UserService.updateProfile(
      userId,
      updateData,
    );

    return sendSuccess(res, {
      user: updatedUser,
    });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.errors?.[0]?.message || error.message,
    );
  }
};

/* ================= GET PROFILE ================= */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserService.getUserById(req.user!.id);

    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, "User not found");
    }

    return sendSuccess(res, {
      user,
    });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message,
    );
  }
};