import { PostService } from "../services/postService";
import { Request, Response } from "express";
import {
  sendSuccess,
  sendError,
  handlePostError,
} from "../utils/errorhandler";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants";

import {
  createPostSchema,
  editPostSchema,
  commentSchema,
} from "../schemas/zodSchema";
import { getParamId } from "../utils/getParamId";

interface AuthRequest extends Request {
  user?: any;
  file?: any;
}

/* ================= CREATE POST ================= */
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const data = createPostSchema.parse(req.body);

    const post = await PostService.createPost(
      req.user.id,
      data,
      req.file?.path,
    );

    return sendSuccess(res, post, HTTP_STATUS.CREATED);
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.errors?.[0]?.message || error.message,
    );
  }
};

/* ================= GET POSTS ================= */
export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const search = (req.query.search as string) || "";
    const limit = 5;

    const posts = await PostService.getPosts(page, search, limit);

    return sendSuccess(res, posts);
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.ERROR_FETCHING_POSTS,
      error.message,
    );
  }
};

/* ================= GET MY POSTS ================= */
export const getMyPosts = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await PostService.getMyPosts(req.user.id);
    return sendSuccess(res, posts);
  } catch (error: any) {
    return handlePostError(res, error);
  }
};

/* ================= DELETE POST ================= */
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = getParamId(req.params.id, res);
    if (!postId) return;

    await PostService.deletePost(postId, req.user.id);

    return sendSuccess(res, { message: "Post deleted" });
  } catch (error: any) {
    return handlePostError(res, error);
  }
};

/* ================= EDIT POST ================= */
export const editPost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = getParamId(req.params.id, res);
    if (!postId) return;

    const data = editPostSchema.parse(req.body);

    const post = await PostService.editPost(postId, req.user.id, data);

    return sendSuccess(res, post);
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.errors?.[0]?.message || error.message,
    );
  }
};

/* ================= LIKE / UNLIKE ================= */
export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = getParamId(req.params.id, res);
    if (!postId) return;

    const post = await PostService.likePost(postId, req.user.id);

    return sendSuccess(res, post);
  } catch (error: any) {
    return handlePostError(res, error);
  }
};

/* ================= COMMENT ================= */
export const commentPost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = getParamId(req.params.id, res);
    if (!postId) return;

    const data = commentSchema.parse(req.body);

    const comment = await PostService.commentPost(
      postId,
      req.user.id,
       data,
    );

    return sendSuccess(res, comment);
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.errors?.[0]?.message || error.message,
    );
  }
};