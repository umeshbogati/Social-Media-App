import API from "./axios";

/* ================= TYPES ================= */

export interface Comment {
  _id?: string;
  user: {
    _id: string;
    username: string;
  };
  text: string;
}

export interface Post {
  _id: string;
  user?: {
    _id: string;
    username: string;
    name?: string;
    profilePicture?: string;
  };
  description: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface CreatePostData {
  description: string;
  image?: File;
}

/* ================= API RESPONSE TYPE ================= */

type PostsResponse = {
  data: Post[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type SinglePostResponse = {
  data: Post;
};

type MessageResponse = {
  message: string;
};

/* ================= SAFE EXTRACTOR ================= */

const extract = <T>(res: any): T => {
  return res?.data?.data ?? res?.data ?? res;
};

/* ================= POSTS ================= */

/** GET POSTS */
export const getPosts = async (
  page = 1,
  search = ""
): Promise<Post[]> => {
  const res = await API.get<PostsResponse>(
    `/posts?page=${page}&search=${search}`
  );

  const data = extract<PostsResponse>(res);

  // IMPORTANT FIX: backend returns {data: posts}
  return Array.isArray(data?.data) ? data.data : [];
};

/** CREATE POST */
export const createPost = async (
  data: CreatePostData
): Promise<Post> => {
  const formData = new FormData();
  formData.append("description", data.description);

  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await API.post<SinglePostResponse>(
    "/posts",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return extract<Post>(res);
};

/** DELETE POST */
export const deletePost = async (
  id: string
): Promise<MessageResponse> => {
  const res = await API.delete(`/posts/${id}`);
  return extract<MessageResponse>(res);
};

/** UPDATE POST */
export const updatePost = async (
  id: string,
  data: { description: string }
): Promise<Post> => {
  const res = await API.put<SinglePostResponse>(
    `/posts/${id}`,
    data
  );

  return extract<Post>(res);
};

/** LIKE POST */
export const likePost = async (
  id: string
): Promise<Post> => {
  const res = await API.put<SinglePostResponse>(
    `/posts/${id}/like`
  );

  return extract<Post>(res);
};

/** ADD COMMENT */
export const addComment = async (
  id: string,
  text: string
): Promise<Comment> => {
  const res = await API.post(
    `/posts/${id}/comment`,
    { text }
  );

  return extract<Comment>(res);
};

/** GET MY POSTS */
export const getMyPosts = async (): Promise<Post[]> => {
  const res = await API.get<PostsResponse>("/posts/me");

  const data = extract<PostsResponse>(res);

  return Array.isArray(res.data?.data) ? data.data : [];
};