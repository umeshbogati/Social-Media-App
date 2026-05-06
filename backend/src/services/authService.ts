import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { IRegisterRequest, IAuthRequest } from "../interfaces";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "../config/env";

/* ================= TOKEN OPTIONS ================= */

const accessOptions: SignOptions = {
  expiresIn: "3h",
};

const refreshOptions: SignOptions = {
  expiresIn: "7d",
};

/* ================= AUTH SERVICE ================= */

export class AuthService {
  /* ================= REGISTER ================= */
  static async register(data: IRegisterRequest) {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
      role: "user",
    });

    const accessToken = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      JWT_SECRET!,
      accessOptions,
    );

    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      JWT_REFRESH_SECRET!,
      refreshOptions,
    );

    user.refreshToken = refreshToken;
    await user.save();

    // ✅ BEST PRACTICE: use select instead of delete
    const safeUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return {
      user: {
        ...safeUser?.toObject(),
        _id: user._id.toString(),
      },
      accessToken,
      refreshToken,
    };
  }

  /* ================= LOGIN ================= */
  static async login(data: IAuthRequest) {
    const user = await User.findOne({ email: data.email });

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      JWT_SECRET!,
      accessOptions,
    );

    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      JWT_REFRESH_SECRET!,
      refreshOptions,
    );

    user.refreshToken = refreshToken;
    await user.save();

    // ✅ clean user response
    const safeUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return {
      user: {
        ...safeUser?.toObject(),
        _id: user._id.toString(),
      },
      accessToken,
      refreshToken,
    };
  }
}