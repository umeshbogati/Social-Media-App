import API from "./axios";

// TYPES

export interface UpdateProfileData {
  name?: string;
  username?: string;
  image?: File;
}

export interface User {
  _id: string;
  username: string;
  name: string;
  email?: string;
  profilePicture?: string;
}
// Helper to extract user from response (handles both /users/me and /auth responses)

const extractUser = (res: any): User => {
  return res?.data?.user ?? res?.data;
};

// Update user profile

export const updateProfile = async (
  data: UpdateProfileData,
): Promise<User> => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.username)
    formData.append("username", data.username);
  if (data.image) formData.append("image", data.image);

  const response = await API.put("/users/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return extractUser(response);
};

// Get current user profile
export const getUserProfile = async (): Promise<User> => {
  const response = await API.get("/users/me");

  return extractUser(response);
};