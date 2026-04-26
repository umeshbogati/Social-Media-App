// filepath: src/hooks/usePosts.ts
import { useState, useCallback } from "react";
import {
  getPosts,
  createPost,
  likePost,
  deletePost,
  unlikePost,
  commentPost,
  type Post,
} from "../api/posts";
import { setPosts } from "../store/slices";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const like = useCallback(async (postId: string) => {
    try {
      await likePost(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likes: [...post.likes, ""] } : post,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const remove = useCallback(async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { posts, loading, error, fetchPosts, addPost, like, remove };
};
//  make unlike code.
