// Error Messages
export const ERROR_MESSAGES = {
  // Auth Errors
  USER_NOT_FOUND: "User not found",
  WRONG_PASSWORD: "Wrong password",
  USER_ALREADY_EXISTS: "User already exists",
  INVALID_EMAIL: "Valid email required",
  WEAK_PASSWORD: "Password must be at least 8 characters",
  WEAK_USERNAME: "Username must be at least 3 characters",
  WEAK_NAME: "Name must be at least 2 characters",

  // Token Errors
  NO_TOKEN_PROVIDED: "No token provided",
  INVALID_TOKEN: "Invalid token",
  TOKEN_EXPIRED: "Token expired",

  // Post Errors
  POST_NOT_FOUND: "Post not found",
  NOT_ALLOWED: "Not allowed",
  DESCRIPTION_REQUIRED: "Description required",
  DESCRIPTION_CANNOT_BE_EMPTY: "Description cannot be empty",
  COMMENT_TEXT_REQUIRED: "Comment text required",

  // General Errors
  REQUEST_BODY_REQUIRED: "Request body is required",
  SERVER_ERROR: "Server error",
  ERROR_CREATING_POST: "Error creating post",
  ERROR_FETCHING_POSTS: "Error fetching posts",
  ERROR_DELETING_POST: "Error deleting post",
  ERROR_UPDATING_POST: "Error updating post",
  ERROR_LIKING_POST: "Error liking post",
  ERROR_COMMENTING: "Error commenting",
} as const;
