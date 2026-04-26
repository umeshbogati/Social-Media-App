// filepath: src/constants/messages.ts
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Login successful",
    LOGIN_ERROR: "Invalid email or password",
    REGISTER_SUCCESS: "Registration successful",
    REGISTER_ERROR: "Registration failed",
    LOGOUT_SUCCESS: "Logged out successfully",
  },
  POSTS: {
    CREATE_SUCCESS: "Post created successfully",
    CREATE_ERROR: "Failed to create post",
    DELETE_SUCCESS: "Post deleted successfully",
    DELETE_ERROR: "Failed to delete post",
    LIKE_SUCCESS: "Post liked",
    LIKE_ERROR: "Failed to like post",
  },
  VALIDATION: {
    REQUIRED: "This field is required",
    EMAIL_INVALID: "Please enter a valid email",
    PASSWORD_SHORT: "Password must be at least 6 characters",
    PASSWORD_MISMATCH: "Passwords do not match",
  },
};
