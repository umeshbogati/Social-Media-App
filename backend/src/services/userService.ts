import User from "../models/user";
import { IUser } from "../interfaces";

type SafeUser = Omit<IUser, "password" | "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export class UserService {
  // UPDATE PROFILE
  static async updateProfile(
    userId: string,
    data: {
      name?: string;
      username?: string;
      profilePicture?: string;
    },
  ): Promise<SafeUser> {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.username !== undefined) user.username = data.username;
    if (data.profilePicture !== undefined) {
      user.profilePicture = data.profilePicture;
    }

    await user.save();

    const obj = user.toObject();

    return {
      _id: obj._id.toString(),
      username: obj.username,
      name: obj.name,
      email: obj.email,
      address: obj.address ?? null,
      phone: obj.phone ?? null,
      profilePicture: obj.profilePicture ?? null,
      role: obj.role,
      refreshToken: obj.refreshToken ?? null,
      createdAt: obj.createdAt.toISOString(),
      updatedAt: obj.updatedAt.toISOString(),
    };
  }

  // GET USER BY ID
  static async getUserById(userId: string): Promise<SafeUser | null> {
    const user = await User.findById(userId).lean();

    if (!user) return null;

    return {
      _id: user._id.toString(),
      username: user.username,
      name: user.name,
      email: user.email,
      address: user.address ?? null,
      phone: user.phone ?? null,
      profilePicture: user.profilePicture ?? null,
      role: user.role,
      refreshToken: user.refreshToken ?? null,
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
    };
  }

  // GET PROFILE
  static async getProfile(userId: string): Promise<SafeUser | null> {
    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) return null;

    return {
      _id: user._id.toString(),
      username: user.username,
      name: user.name,
      email: user.email,
      address: user.address ?? null,
      phone: user.phone ?? null,
      profilePicture: user.profilePicture ?? null,
      role: user.role,
      refreshToken: user.refreshToken ?? null,
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
    };
  }
}