import { UserService } from "../services/userService";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: any;
}

export const uploadProfilePicture = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await UserService.updateProfilePicture(userId, req.file.path);
    res.json(user);
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
