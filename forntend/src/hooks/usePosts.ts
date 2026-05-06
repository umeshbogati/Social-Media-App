import { useState, useCallback } from "react";
import {
  getPosts,
  createPost,
  likePost,
  deletePost,
  type Post,
} from "../api/posts";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH POSTS ================= */
  const fetchPosts = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPosts(page);

      if (page === 1) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= CREATE POST ================= */
  const addPost = useCallback(
    async (description: string, image?: File) => {
      setLoading(true);

      try {
        await createPost({ description, image });
        await fetchPosts(1);
      } catch (err) {
        setError("Failed to create post");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts],
  );

  /* ================= LIKE / UNLIKE TOGGLE ================= */
  const like = useCallback(async (postId: string, userId: string) => {
    try {
      await likePost(postId);

      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;

          const isLiked = post.likes.includes(userId);

          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((id) => id !== userId) // UNLIKE
              : [...post.likes, userId], // LIKE
          };
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  /* ================= DELETE POST ================= */
  const remove = useCallback(async (postId: string) => {
    try {
      await deletePost(postId);

      setPosts((prev) =>
        prev.filter((post) => post._id !== postId),
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    addPost,
    like,
    remove,
  };
};