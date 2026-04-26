// filepath: src/schemas/post.ts
export const postSchema = {
  description: {
    required: "Description is required",
    maxLength: {
      value: 500,
      message: "Description must be less than 500 characters",
    },
  },
  image: {
    maxSize: {
      value: 5 * 1024 * 1024, // 5MB
      message: "Image must be less than 5MB",
    },
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  },
};
