import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getPosts,
  createPost,
  likePost,
  deletePost,
  updatePost,
  addComment,
} from "../api/posts";

import type { Post } from "../types/post";

import { MainLayout } from "../components/Layout";

import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";

import {
  Favorite,
  FavoriteBorder,
  Delete,
  Edit,
  AddPhotoAlternate,
} from "@mui/icons-material";

const Home = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [page, setPage] = useState(1);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const [commentMap, setCommentMap] = useState<Record<string, string>>({});
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);


//fetch posts
  const fetchPosts = async () => {
    try {
      const res = await getPosts(page);

      const newPosts = res || [];

      setPosts((prev) =>
        page === 1 ? newPosts : [...prev, ...newPosts]
      );
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [page]);

  // Create post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);

    try {
      const newPost = await createPost({
        description,
        image: image || undefined,
      });

      if (newPost) {
        setPosts((prev) => [newPost, ...prev]);
      }

      setDescription("");
      setImage(null);
    } catch (err) {
      console.error("Create error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Like
  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const updated = await likePost(postId);

      if (updated) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? updated : p))
        );
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Delete post
  const handleDelete = async (postId: string) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await deletePost(postId);

      setPosts((prev) =>
        prev.filter((p) => p._id !== postId)
      );
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Update post
  const handleUpdatePost = async (postId: string) => {
    if (!editText.trim()) return;

    try {
      const updated = await updatePost(postId, {
        description: editText,
      });

      if (updated) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? updated : p))
        );
      }

      setEditingPostId(null);
      setEditText("");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Add comment
  const handleAddComment = async (postId: string) => {
    const text = commentMap[postId];
    if (!text?.trim()) return;

    try {
      const updated = await addComment(postId, text);

      if (updated) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? updated : p))
        );
      }

      setCommentMap((prev) => ({
        ...prev,
        [postId]: "",
      }));

      setActiveCommentPost(null);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  // Like check
  const isLiked = (post: Post): boolean => {
    if (!user) return false;

    return post.likes?.some((id: any) =>
      String(id?._id ?? id) === String(user._id)
    );
  };

  // UI
  return (
    <MainLayout>
      <Box sx={{ maxWidth: 600, mx: "auto", py: 2 }}>

        {/* CREATE POST */}
        <Card sx={{ mb: 3, p: 2 }}>
          <form onSubmit={handleCreatePost}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What's on your mind?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Box display="flex" justifyContent="space-between" mt={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <label>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      setImage(e.target.files?.[0] || null)
                    }
                  />
                  <IconButton component="span" color={image ? "primary" : "default"}>
                    <AddPhotoAlternate />
                  </IconButton>
                </label>
                {image && (
                  <Typography variant="body2" color="text.secondary">
                    {image.name}
                  </Typography>
                )}
              </Box>

              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Posting..." : "Post"}
              </Button>
            </Box>
          </form>
        </Card>

        {/* POSTS */}
        {loading ? (
          <CircularProgress />
        ) : !Array.isArray(posts) || posts.length === 0 ? (
          <Typography textAlign="center">
            No posts yet 
          </Typography>
        ) : (
          posts.map((post) => {
            const owner =
              typeof post.user !== "string" ? post.user : null;

            const isOwner = owner?._id === user?._id;

            return (
              <Card key={post._id} sx={{ mb: 2 }}>
                <CardContent>

                  {/* USER */}
                  <Typography fontWeight="bold">
                    {owner?.username || "User"}
                  </Typography>

                  {/* EDIT */}
                  {editingPostId === post._id ? (
                    <>
                      <TextField
                        fullWidth
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      <Box display="flex" gap={1} mt={1}>
                        <Button onClick={() => handleUpdatePost(post._id)}>
                          Save
                        </Button>

                        <Button onClick={() => setEditingPostId(null)}>
                          Cancel
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Typography sx={{ my: 1 }}>
                      {post.description}
                    </Typography>
                  )}

                  {/* IMAGE */}
                  {post.image && (
                    <Box
                      sx={{
                        width: "100%",
                        maxHeight: 500,
                        overflow: "hidden",
                        borderRadius: 3,
                        mb: 2,
                        mt: 1
                      }}
                    >
                      <img
                        src={post.image}
                        alt="post"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block"
                        }}
                      />
                    </Box>
                  )}

                  {/* ACTIONS */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton onClick={() => handleLike(post._id)}>
                      {isLiked(post) ? (
                        <Favorite color="error" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>

                    <Typography>{post.likes?.length || 0}</Typography>

                    {isOwner && (
                      <IconButton
                        onClick={() => {
                          setEditingPostId(post._id);
                          setEditText(post.description || "");
                        }}
                      >
                        <Edit />
                      </IconButton>
                    )}

                    {isOwner && (
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(post._id)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>

                  {/* COMMENTS */}
                  <Box mt={2}>
                    <Button
                      size="small"
                      onClick={() =>
                        setActiveCommentPost(
                          activeCommentPost === post._id
                            ? null
                            : post._id
                        )
                      }
                    >
                      Comments
                    </Button>

                    {activeCommentPost === post._id && (
                      <Box mt={1}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Write comment..."
                          value={commentMap[post._id] || ""}
                          onChange={(e) =>
                            setCommentMap((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                        />

                        <Button
                          onClick={() => handleAddComment(post._id)}
                          sx={{ mt: 1 }}
                        >
                          Post
                        </Button>

                        <Box mt={1}>
                          {(post.comments || []).map((c: any, i: number) => (
                            <Typography key={c._id || i}>
                              <b>
                                {typeof c.user === "string"
                                  ? "User"
                                  : c.user?.username}
                              </b>
                              : {c.text}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>

                </CardContent>
              </Card>
            );
          })
        )}

        {/* LOAD MORE */}
        <Box textAlign="center" py={3}>
          <Button onClick={() => setPage((p) => p + 1)}>
            Load More
          </Button>
        </Box>

      </Box>
    </MainLayout>
  );
};

export default Home;