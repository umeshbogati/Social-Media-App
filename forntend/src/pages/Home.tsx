import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getPosts,
  createPost,
  likePost,
  deletePost,
  updatePost,
  addComment,
  type Post,
} from "../api/posts";

import { MainLayout } from "../components/Layout";

import {
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";

import {
  Favorite,
  FavoriteBorder,
  Delete,
  Edit,
  AddPhotoAlternate,
} from "@mui/icons-material";

/* ================= COMPONENT ================= */

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

  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  /* ================= FETCH POSTS ================= */
const fetchPosts = async () => {
  try {
    const newPosts = await getPosts(page);

    // const newPosts: Post[] = Array.isArray(res?.data)
    //   ? res.data
    //   : [];

    setPosts((prev) =>
      page === 1 ? newPosts : [...prev, ...newPosts],
    );
  } catch (err) {
    console.error("Fetch posts error:", err);
    setPosts([]);
  } finally {
    setLoading(false);
  }
};

  /* IMPORTANT: call fetch */
  useEffect(() => {
    fetchPosts();
  }, [page]);

  /* ================= CREATE POST ================= */

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) return;

    setSubmitting(true);

    try {
      await createPost({
        description,
        image: image || undefined,
      });

      setDescription("");
      setImage(null);
      setPage(1);
      fetchPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= LIKE ================= */

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      await likePost(postId);

      setPosts((prev) =>
        prev.map((post) => {
          if (post._id !== postId) return post;

          const isLiked = post.likes.includes(user._id);

          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((id) => id !== user._id)
              : [...post.likes, user._id],
          };
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await deletePost(postId);

      setPosts((prev) =>
        prev.filter((post) => post._id !== postId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UPDATE ================= */

  const handleUpdatePost = async (postId: string) => {
    try {
      const updated = await updatePost(postId, {
        description: editText,
      });

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? updated : post
        )
      );

      setEditingPostId(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= COMMENT ================= */

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;

    try {
      const newComment = await addComment(postId, commentText);

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment],
              }
            : post
        )
      );

      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 600, mx: "auto", py: 2 }}>

        {/* CREATE POST */}
        <Card sx={{ mb: 3, p: 2, borderRadius: 3 }}>
          <form onSubmit={handleCreatePost}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What's on your mind?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box display="flex" justifyContent="space-between">
              <label>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files?.[0] || null)
                  }
                />
                <IconButton component="span">
                  <AddPhotoAlternate />
                </IconButton>
              </label>

              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
              >
                {submitting ? "Posting..." : "Post"}
              </Button>
            </Box>
          </form>
        </Card>

        {/* POSTS */}
        {loading ? (
          <Box textAlign="center" py={5}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography textAlign="center">
            No posts yet .
          </Typography>
        ) : (
          posts.map((post) => {
            const isLiked = user
              ? post.likes.includes(user._id)
              : false;

            const isOwner = post.user?._id === user?._id;

            return (
              <Card key={post._id} sx={{ mb: 2, borderRadius: 3 }}>
                <CardContent>

                  {/* HEADER */}
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontWeight="bold">
                      {post.user?.username}
                    </Typography>

                    {isOwner && (
                      <Box>
                        <IconButton
                          onClick={() => {
                            setEditingPostId(post._id);
                            setEditText(post.description);
                          }}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => handleDelete(post._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  {/* DESCRIPTION */}
                  {editingPostId === post._id ? (
                    <>
                      <TextField
                        fullWidth
                        value={editText}
                        onChange={(e) =>
                          setEditText(e.target.value)
                        }
                      />

                      <Box mt={1}>
                        <Button onClick={() => handleUpdatePost(post._id)}>
                          Save
                        </Button>
                        <Button onClick={() => setEditingPostId(null)}>
                          Cancel
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Typography sx={{ my: 2 }}>
                      {post.description}
                    </Typography>
                  )}

                  {/* IMAGE */}
                  {post.image && (
                    <CardMedia component="img" image={post.image} />
                  )}

                  <Divider sx={{ my: 1 }} />

                  {/* ACTIONS */}
                  <Box display="flex" gap={1}>
                    <IconButton onClick={() => handleLike(post._id)}>
                      {isLiked ? (
                        <Favorite color="error" />
                      ) : (
                        <FavoriteBorder />
                      )}
                    </IconButton>

                    <Typography>{post.likes.length}</Typography>

                    <Button
                      onClick={() =>
                        setShowComments(
                          showComments === post._id
                            ? null
                            : post._id
                        )
                      }
                    >
                      Comments
                    </Button>
                  </Box>

                  {/* COMMENTS */}
                  {showComments === post._id && (
                    <Box mt={2}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Write comment..."
                        value={commentText}
                        onChange={(e) =>
                          setCommentText(e.target.value)
                        }
                      />

                      <Button onClick={() => handleAddComment(post._id)}>
                        Post
                      </Button>

                      {(post.comments || []).map((c, i) => (
                        <Typography key={i}>
                          <b>{c.user?.username}</b>: {c.text}
                        </Typography>
                      ))}
                    </Box>
                  )}

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