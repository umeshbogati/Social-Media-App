import User from "../models/user";
import { IUser } from "../interfaces";

export class UserService {
  static async updateProfilePicture(
    userId: string,
    imagePath: string,
  ): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.profilePicture = imagePath;
    await user.save();

    const { password, ...userData } = user.toObject();
    return userData;
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) return null;
    const { password, ...userData } = user.toObject();
    return userData;
  }
}
