import mongoose from "mongoose";
import Post from "../models/post";
import {
  IPost,
  ICreatePostRequest,
  IEditPostRequest,
  ICommentRequest,
} from "../interfaces";

export class PostService {
  static async createPost(
    userId: string,
    data: ICreatePostRequest,
    imagePath?: string,
  ): Promise<any> {
    const post = new Post({
      userId,
      description: data.description,
      image: imagePath || "",
    });
    await post.save();
    return post.toObject();
  }

  static async getPosts(
    page: number = 1,
    search: string = "",
    limit: number = 5,
  ): Promise<any[]> {
    const posts = await Post.find({
      description: { $regex: search, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "username name profilePicture");
    return posts.map((post) => post.toObject());
  }

  static async deletePost(postId: string, userId: string): Promise<void> {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");
    if (post.userId.toString() !== userId) throw new Error("Not allowed");

    await post.deleteOne();
  }

  static async editPost(
    postId: string,
    userId: string,
    data: IEditPostRequest,
  ): Promise<any> {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");
    if (post.userId.toString() !== userId) throw new Error("Not allowed");

    if (data.description) post.description = data.description;
    await post.save();
    return post.toObject();
  }

  static async likePost(postId: string, userId: string): Promise<any> {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const userIdStr = userId;
    if (post.likes.some((id: any) => id.toString() === userIdStr)) {
      post.likes = post.likes.filter((id: any) => id.toString() !== userIdStr);
    } else {
      post.likes.push(new mongoose.Types.ObjectId(userIdStr));
    }

    await post.save();
    return post.toObject();
  }

  static async commentPost(
    postId: string,
    userId: string,
    data: ICommentRequest,
  ): Promise<IPost> {
    const post = await Post.findById(postId);
    if (!post) throw new Error("Post not found");

    const comment = {
      userId: new mongoose.Types.ObjectId(userId),
      text: data.text,
    };

    post.comments.push(comment);
    await post.save();
    return post.toObject();
  }
}
