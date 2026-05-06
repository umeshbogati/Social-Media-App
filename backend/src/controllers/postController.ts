import { Request, Response } from "express";
import { PostService } from "../services/postService";

import {
  sendSuccess,
  sendError,
  handlePostError,
} from "../utils/errorhandler";

import { HTTP_STATUS } from "../constants";

import {
  createPostSchema,
  editPostSchema,
  commentSchema,
} from "../schemas/zodSchema";

import { getParamId } from "../utils/getParamId";

/* ================= TYPES ================= */

interface AuthUser {
  id: string;
  role?: string;
}

interface AuthRequest extends Request {
  user?: AuthUser;
  file?: Express.Multer.File;
}

/* ================= CREATE POST ================= */
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
    }

    const data = createPostSchema.parse(req.body);

    const image = req.file?.path ?? undefined;

    const post = await PostService.createPost(
      req.user.id,
      data,
      image
    );

    return sendSuccess(res, { post }, HTTP_STATUS.CREATED);
  } catch (error: any) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, error.message);
  }
};

/* ================= GET POSTS ================= */
export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const search = String(req.query.search || "");
    const limit = Number(req.query.limit) || 10;

    const posts = await PostService.getPosts(page, search, limit);

    return sendSuccess(res, { posts });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

/* ================= GET MY POSTS ================= */
export const getMyPosts = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
    }

    const posts = await PostService.getMyPosts(req.user.id);

    return sendSuccess(res, { posts });
  } catch (error: any) {
    return handlePostError(res, error);
  }
};

/* ================= DELETE POST ================= */
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
    }

    const postId = getParamId(req.params.id, res);
    if (!postId) return;

    const result = await PostService.deletePost(
      postId,
      req.user.id
    );

    return sendSuccess(res, result);
  } catch (error: any) {
    return handlePostError(res, error);
  }
};

/* ================= EDIT POST ================= */
export const editPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
    }

    const postId = getParamId(req.params.id, res);
    if (!postId) return;

    const data = editPostSchema.parse(req.body);

    const post = await PostService.editPost(
      postId,
      req.user.id,
      data
    );

    return sendSuccess(res, { post });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};

/* ================= LIKE ================= */
export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
    }

    const postId = getParamId(req.params.id, res);
    if (!postId) return;

    const post = await PostService.likePost(
      postId,
      req.user.id
    );

    return sendSuccess(res, { post });
  } catch (error: any) {
    return handlePostError(res, error);
  }
};

/* ================= COMMENT ================= */
export const commentPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
    }

    const postId = getParamId(req.params.id, res);
    if (!postId) return;

    const data = commentSchema.parse(req.body);

    const post = await PostService.commentPost(
      postId,
      req.user.id,
      data
    );

    return sendSuccess(res, { post });
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      error.message
    );
  }
};