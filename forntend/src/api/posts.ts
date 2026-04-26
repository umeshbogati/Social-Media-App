import API from "./axios";

export interface Post {
  _id: string;
  userId: {
    _id: string;
    username: string;
    name?: string;
    profilePicture?: string;
  };
  description: string;
  image?: string;
  likes: string[];
  comments: Array<{ userId: string; text: string }>;
  createdAt: string;
}

export interface CreatePostData {
  description: string;
  image?: File;
}

export const getPosts = async (page = 1, search = "") => {
  const response = await API.get(`/posts?page=${page}&search=${search}`);
  return response.data.data || response.data;
};

export const createPost = async (data: CreatePostData) => {
  const formData = new FormData();
  formData.append("description", data.description);
  if (data.image) {
    formData.append("image", data.image);
  }
  const response = await API.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await API.delete(`/posts/${id}`);
  return response.data;
};

export const editPost = async (id: string, description: string) => {
  const response = await API.put(`/posts/${id}`, { description });
  return response.data;
};

export const likePost = async (id: string) => {
  const response = await API.put(`/posts/${id}/like`);
  return response.data;
};

export const commentPost = async (id: string, text: string) => {
  const response = await API.post(`/posts/${id}/comment`, { text });
  return response.data;
};
