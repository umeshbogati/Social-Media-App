import API from "./axios";

const unwrap = (res: any) => res.data?.data;

export const getPosts = async (page = 1) => {
  const res = await API.get(`/posts?page=${page}`);
  return unwrap(res) ?? [];
};

export const createPost = async (payload: { description: string; image?: File }) => {
  const formData = new FormData();
  formData.append("description", payload.description);
  if (payload.image) formData.append("image", payload.image);

  const res = await API.post("/posts", formData);
  return unwrap(res);
};

export const updatePost = async (id: string, data: { description: string }) => {
  const res = await API.put(`/posts/${id}`, data);
  return unwrap(res);
};

export const deletePost = async (id: string) => {
  const res = await API.delete(`/posts/${id}`);
  return unwrap(res);
};

export const likePost = async (id: string) => {
  const res = await API.put(`/posts/${id}/like`);
  return unwrap(res);
};

export const addComment = async (id: string, text: string) => {
  const res = await API.post(`/posts/${id}/comment`, { text });
  return unwrap(res);
};