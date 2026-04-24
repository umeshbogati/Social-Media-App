import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IRegisterRequest, IAuthRequest, IUser } from "../interfaces";

export class AuthService {
  static async register(data: IRegisterRequest): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User({ ...data, password: hashedPassword });
    await user.save();
    return user.toObject();
  }

  static async login(
    data: IAuthRequest,
  ): Promise<{ user: IUser; token: string; expiresIn: string }> {
    const user = await User.findOne({ email: data.email });
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) throw new Error("Wrong password");

    const expiresIn = process.env.JWT_EXPIRES_IN || "3d";
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn,
    } as jwt.SignOptions);

    const { password, ...userData } = user.toObject();
    return { user: userData, token, expiresIn };
  }
}
