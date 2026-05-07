import { useState, useCallback } from "react";
import {
  getPosts,
  createPost,
  likePost,
  deletePost,
} from "../api/posts";
import type { Post } from "../types/post";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts
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

  // Create post
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

  // Like / Unlike toggle
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
              ? post.likes.filter((id: any) => id !== userId) // UNLIKE
              : [...post.likes, userId], // LIKE
          };
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Delete post
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