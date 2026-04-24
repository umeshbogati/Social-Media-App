import { PostService } from "../services/postService";
import {
  validateCreatePost,
  validateEditPost,
  validateComment,
} from "../schemas/validation";
import { Request, Response } from "express";
import {
  sendSuccess,
  sendError,
  handlePostError,
  handleValidationError,
} from "../utils/errorhandler";
import { HTTP_STATUS, ERROR_MESSAGES } from "../constants";

interface AuthRequest extends Request {
  user?: any;
  file?: any;
}

// CREATE POST
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    // Check if request body exists
    if (!req.body) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.REQUEST_BODY_REQUIRED,
      );
    }

    const errors = validateCreatePost(req.body);
    if (errors.length > 0) {
      return handleValidationError(res, errors);
    }

    const post = await PostService.createPost(
      req.user.id,
      req.body,
      req.file?.path,
    );
    return sendSuccess(res, post, HTTP_STATUS.CREATED);
  } catch (error: any) {
    return sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.ERROR_CREATING_POST,
      error.message,
    );
  }
};

// GET POSTS (pagination + search)
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

// DELETE POST
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    await PostService.deletePost(req.params.id as string, req.user.id);
    return sendSuccess(res, { message: "Post deleted successfully" });
  } catch (error: any) {
    return handlePostError(res, error);
  }
};

// EDIT POST
export const editPost = async (req: AuthRequest, res: Response) => {
  try {
    // Check if request body exists
    if (!req.body) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.REQUEST_BODY_REQUIRED,
      );
    }

    const errors = validateEditPost(req.body);
    if (errors.length > 0) {
      return handleValidationError(res, errors);
    }

    const post = await PostService.editPost(
      req.params.id as string,
      req.user.id,
      req.body,
    );
    return sendSuccess(res, post);
  } catch (error: any) {
    return handlePostError(res, error);
  }
};

// LIKE / UNLIKE POST
export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await PostService.likePost(
      req.params.id as string,
      req.user.id,
    );
    return sendSuccess(res, post);
  } catch (error: any) {
    return handlePostError(res, error);
  }
};

// COMMENT ON POST
export const commentPost = async (req: AuthRequest, res: Response) => {
  try {
    // Check if request body exists
    if (!req.body) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.REQUEST_BODY_REQUIRED,
      );
    }

    const errors = validateComment(req.body);
    if (errors.length > 0) {
      return handleValidationError(res, errors);
    }

    const post = await PostService.commentPost(
      req.params.id as string,
      req.user.id,
      req.body,
    );
    return sendSuccess(res, post);
  } catch (error: any) {
    return handlePostError(res, error);
  }
};
