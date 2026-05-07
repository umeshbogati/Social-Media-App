import mongoose from "mongoose";
import Post from "../models/post";

import {
  ICreatePostRequest,
  IEditPostRequest,
  ICommentRequest,
} from "../interfaces";

export class PostService {

  // CREATE
  static async createPost(
    userId: string,
    data: ICreatePostRequest,
    imagePath?: string
  ) {
    const post = await Post.create({
      user: new mongoose.Types.ObjectId(userId),
      description: data.description,
      image: imagePath || null,
      likes: [],
      comments: [],
    });

    return await post.populate(
      "user",
      "username name profilePicture"
    );
  }

  // GET POSTS
  static async getPosts(
    page = 1,
    search = "",
    limit = 10
  ) {
    const skip = (page - 1) * limit;

    return await Post.find(
      search
        ? { description: { $regex: search, $options: "i" } }
        : {}
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username name profilePicture")
      .populate("comments.user", "username profilePicture")
      .lean();
  }

  // GET MY POSTS
  static async getMyPosts(userId: string) {
    return await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "username name profilePicture")
      .populate("comments.user", "username profilePicture")
      .lean();
  }

  // DELETE
  static async deletePost(postId: string, userId: string) {
    const post = await Post.findById(postId);

    if (!post) throw new Error("Post not found");

    if (!post.user || post.user.toString() !== userId.toString()) {
      throw new Error("Not authorized");
    }

    await Post.findByIdAndDelete(postId);

    return { message: "Post deleted successfully" };
  }

  /* ================= EDIT ================= */
  static async editPost(
    postId: string,
    userId: string,
    data: IEditPostRequest
  ) {
    const post = await Post.findById(postId);

    if (!post) throw new Error("Post not found");

    if (!post.user || post.user.toString() !== userId.toString()) {
      throw new Error("Not authorized");
    }

    post.description = data.description || post.description;

    await post.save();

    return await post.populate(
      "user",
      "username name profilePicture"
    );
  }

  // LIKE (ATOMIC SAFE VERSION)
  static async likePost(postId: string, userId: string) {
    const uid = new mongoose.Types.ObjectId(userId);

    const post = await Post.findById(postId);

    if (!post) throw new Error("Post not found");

    const isLiked = post.likes.some(
      (id: any) => id.toString() === userId
    );

    const update = isLiked
      ? { $pull: { likes: uid } }
      : { $addToSet: { likes: uid } };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      update,
      { new: true }
    )
      .populate("user", "username name profilePicture");

    return updatedPost;
  }

  // COMMENT (SAFE + FAST)
  static async commentPost(
    postId: string,
    userId: string,
    data: ICommentRequest
  ) {
    const comment = {
      user: new mongoose.Types.ObjectId(userId),
      text: data.text,
      createdAt: new Date(),
    };

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    ).populate(
      "comments.user",
      "username profilePicture"
    );

    if (!post) throw new Error("Post not found");

    return post;
  }
}