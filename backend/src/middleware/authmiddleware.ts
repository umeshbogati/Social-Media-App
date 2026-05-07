import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}
// Middleware to protect routes
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.id).select("_id role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    
    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next(); 
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
