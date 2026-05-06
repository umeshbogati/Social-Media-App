import mongoose from "mongoose";
import Post from "../models/post";
import {
  ICreatePostRequest,
  IEditPostRequest,
  ICommentRequest,
} from "../interfaces";

export class PostService {
  /* ================= CREATE POST ================= */
  static async createPost(
    userId: string,
    data: ICreatePostRequest,
    imagePath?: string,
  ) {
    const post = await Post.create({
      user: userId, // ✅ FIXED
      description: data.description,
      image: imagePath || null,
      likes: [],
      comments: [],
    });

    return post.populate("user", "username name profilePicture");
  }

  /* ================= GET POSTS (WITH PAGINATION + METADATA) ================= */
  static async getPosts(page = 1, search = "", limit = 5) {
  const skip = (page - 1) * limit;

  const filter = {
    description: { $regex: search, $options: "i" },
  };

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "username name profilePicture")
    .populate("comments.user", "username profilePicture")
    .lean();

  return posts; // ✅ ONLY ARRAY
}

  /* ================= GET MY POSTS ================= */
  static async getMyPosts(userId: string) {
    return Post.find({ user: userId }) // ✅ FIXED
      .sort({ createdAt: -1 })
      .populate("user", "username name profilePicture")
      .populate("comments.user", "username profilePicture")
      .lean();
  }

  /* ================= DELETE POST ================= */
  static async deletePost(postId: string, userId: string) {
    const post = await Post.findById(postId);

    if (!post) throw new Error("Post not found");

    if (post.user.toString() !== userId) {
      throw new Error("Not authorized");
    }

    await post.deleteOne();
  }

  /* ================= EDIT POST ================= */
  static async editPost(
    postId: string,
    userId: string,
    data: IEditPostRequest,
  ) {
    const post = await Post.findById(postId);

    if (!post) throw new Error("Post not found");

    if (post.user.toString() !== userId) {
      throw new Error("Not authorized");
    }

    if (data.description) {
      post.description = data.description;
    }

    await post.save();

    return post.populate("user", "username name profilePicture");
  }

  /* ================= LIKE / UNLIKE ================= */
  static async likePost(postId: string, userId: string) {
    const post = await Post.findById(postId);

    if (!post) throw new Error("Post not found");

    const uid = new mongoose.Types.ObjectId(userId);

    const index = post.likes.findIndex((id: any) => id.equals(uid));

    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(uid);
    }

    await post.save();

    return post.populate("user", "username name profilePicture");
  }

  /* ================= COMMENT ================= */
  static async commentPost(
    postId: string,
    userId: string,
    data: ICommentRequest,
  ) {
    const post = await Post.findById(postId);

    if (!post) throw new Error("Post not found");

    const comment = {
      user: new mongoose.Types.ObjectId(userId), // ✅ FIXED
      text: data.text,
    };

    post.comments.push(comment as any);

    await post.save();

    return post.populate("comments.user", "username profilePicture");
  }
}