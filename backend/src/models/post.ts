import mongoose, { Schema, Types, Document } from "mongoose";

/* ================= COMMENT INTERFACE ================= */

export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

/* ================= POST INTERFACE ================= */

export interface IPost extends Document {
  user: Types.ObjectId;
  description: string;
  image?: string | null;
  likes: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

/* ================= COMMENT SCHEMA ================= */

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* ================= POST SCHEMA ================= */

const postSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    image: {
      type: String,
      default: null,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

/* ================= MODEL ================= */

export default mongoose.model<IPost>("Post", postSchema);