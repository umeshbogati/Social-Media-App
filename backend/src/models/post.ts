import mongoose, { Schema, Types, Document } from "mongoose";

// comment interface
export interface IComment {
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
// post interface

export interface IPost extends Document {
  user: Types.ObjectId;
  description: string;
  image?: string | null;
  likes: Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

// Comment Schema

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

// Post Schema

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

// Model

export default mongoose.model<IPost>("Post", postSchema);