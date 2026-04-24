import mongoose from "mongoose";
import { time } from "node:console";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    address: { type: String },
    phone: { type: String },
    profilePicture: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);