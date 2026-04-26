// filepath: src/constants/api.ts
export const API_BASE_URL = "http://localhost:5000/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  POSTS: {
    BASE: "/posts",
    LIKE: (id: string) => `/posts/${id}/like`,
    COMMENT: (id: string) => `/posts/${id}/comment`,
  },
  USERS: {
    BASE: "/users",
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
  },
};
