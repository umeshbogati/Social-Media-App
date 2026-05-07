import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

// User Interface

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  address?: string | null;
  phone?: string | null;
  profilePicture?: string | null;
  role: "user" | "admin";
  refreshToken?: string | null;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}
// User Schema
const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    address: { type: String, default: null },
    phone: { type: String, default: null },
    profilePicture: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);
// Pre-save hook to hash password
userSchema.pre<IUser>("save", async function () {
  try {
    if (!this.isModified("password")) return ;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    
  } catch (err) {
    throw err;
  }
});

// Methods
userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Model

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;