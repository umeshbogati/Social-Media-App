import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getMyPosts,
  deletePost,
  updatePost,
  likePost,
  addComment,
} from "../api/posts";

import { updateProfile } from "../api/users";

import type { Post } from "../types/post";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  TextField,
  Button,
} from "@mui/material";

import {
  Favorite,
  FavoriteBorder,
  Delete,
  Edit,
} from "@mui/icons-material";

import { MainLayout } from "../components/Layout";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const [commentMap, setCommentMap] = useState<Record<string, string>>({});
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  const handleEditProfileClick = () => {
    setEditName(user?.name || "");
    setEditUsername(user?.username || "");
    setEditImage(null);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateProfile({
        name: editName,
        username: editUsername,
        image: editImage || undefined,
      });
      updateUser(updatedUser);
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    }
  };

  // Fetch my posts
  const fetchMyPosts = async () => {
    try {
      const data = await getMyPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch posts error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  // Delete post
  const handleDelete = async (postId: string) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Update post
  const handleUpdate = async (postId: string) => {
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
      <Box sx={{ maxWidth: 800, mx: "auto", py: 3, px: 2 }}>

        {/* VIBRANT USER INFO BANNER */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            background: "#fff",
            position: "relative",
          }}
        >
          {/* Cover Photo Area / Gradient Banner */}
          <Box
            sx={{
              height: 200,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          />

          {/* Profile Info Section */}
          <Box sx={{ px: 4, pb: 4, pt: 8, position: "relative" }}>
            {/* Overlapping Avatar */}
            <Avatar
              sx={{
                width: 120,
                height: 120,
                position: "absolute",
                top: -60,
                left: 32,
                border: "4px solid #fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                fontSize: 48,
              bgcolor: "#f0f0f0",
              color: "#333",
            }}
            src={user?.profilePicture}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>

          {isEditingProfile ? (
            <Box mt={2}>
              <Typography variant="h5" fontWeight="bold" mb={3}>Edit Profile</Typography>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <Box>
                  <Button variant="outlined" component="label" sx={{ textTransform: "none", borderRadius: 2 }}>
                    Upload New Profile Picture
                    <input type="file" hidden accept="image/*" onChange={(e) => setEditImage(e.target.files?.[0] || null)} />
                  </Button>
                  {editImage && <Typography variant="caption" sx={{ ml: 2 }}>{editImage.name}</Typography>}
                </Box>
                <Box display="flex" gap={2} mt={1}>
                  <Button variant="contained" onClick={handleSaveProfile} sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" color="inherit" onClick={() => setIsEditingProfile(false)} sx={{ borderRadius: 2, textTransform: "none" }}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                <Box>
                  <Typography variant="h4" fontWeight="800" letterSpacing="-0.5px">
                    {user?.name || "Your Name"}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" fontWeight="500">
                    @{user?.username || "username"}
                  </Typography>
                  {user?.email && (
                    <Typography variant="subtitle2" color="text.secondary" mt={0.5}>
                      {user.email}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleEditProfileClick}
                  sx={{
                    borderRadius: 20,
                    textTransform: "none",
                    fontWeight: "bold",
                    borderColor: "#764ba2",
                    color: "#764ba2",
                    "&:hover": {
                      borderColor: "#667eea",
                      background: "rgba(102, 126, 234, 0.04)"
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Box>

              <Box mt={3} display="flex" gap={4}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {posts.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posts
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Followers
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Following
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
        </Card>

        {/* POSTS SECTION */}
        <Typography variant="h6" fontWeight="bold" mb={2} pl={1}>
          Your Posts
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box
            textAlign="center"
            py={8}
            sx={{
              background: "#f9f9f9",
              borderRadius: 4,
              border: "1px dashed #ccc"
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No posts yet 🚀
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Share something with your friends!
            </Typography>
          </Box>
        ) : (
          posts.map((post) => {
            const owner = typeof post.user !== "string" ? post.user : null;

            return (
              <Card
                key={post._id}
                sx={{
                  mb: 3,
                  borderRadius: 4,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>

                  {/* HEADER */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ width: 40, height: 40 }}>
                        {owner?.username?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="bold" lineHeight={1}>
                          {owner?.name || user?.name || "User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{owner?.username || user?.username}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <IconButton
                        size="small"
                        sx={{ mr: 1, color: "text.secondary" }}
                        onClick={() => {
                          setEditingPostId(post._id);
                          setEditText(post.description);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(post._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* EDIT MODE OR DESCRIPTION */}
                  {editingPostId === post._id ? (
                    <Box mt={2} mb={2} p={2} sx={{ background: "#f5f5f5", borderRadius: 2 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2, background: "#fff", borderRadius: 1 }}
                      />

                      <Box display="flex" gap={1}>
                        <Button
                          variant="contained"
                          disableElevation
                          onClick={() => handleUpdate(post._id)}
                          sx={{ borderRadius: 8, textTransform: "none", fontWeight: "bold" }}
                        >
                          Save Changes
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingPostId(null);
                            setEditText("");
                          }}
                          sx={{ borderRadius: 8, textTransform: "none" }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography sx={{ mb: 2, fontSize: "1.05rem", lineHeight: 1.6 }}>
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
                        mb: 2
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

                  {/* ACTIONS BAR (LIKE & COMMENT) */}
                  <Box display="flex" alignItems="center" gap={2} borderTop="1px solid #f0f0f0" pt={1.5} mt={1}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <IconButton onClick={() => handleLike(post._id)} size="small">
                        {isLiked(post) ? (
                          <Favorite color="error" />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>
                      <Typography variant="body2" fontWeight="bold">
                        {post.likes?.length || 0}
                      </Typography>
                    </Box>
                    <Box>
                      <Button
                        size="small"
                        sx={{ textTransform: "none", color: "text.secondary", fontWeight: "bold" }}
                        onClick={() =>
                          setActiveCommentPost(
                            activeCommentPost === post._id ? null : post._id
                          )
                        }
                      >
                        {post.comments?.length || 0} Comments
                      </Button>
                    </Box>
                  </Box>

                  {/* COMMENTS SECTION */}
                  {activeCommentPost === post._id && (
                    <Box mt={2} p={2} sx={{ background: "#fafafa", borderRadius: 2 }}>
                      <Box display="flex" gap={1} mb={2}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Write a comment..."
                          value={commentMap[post._id] || ""}
                          onChange={(e) =>
                            setCommentMap((prev) => ({
                              ...prev,
                              [post._id]: e.target.value,
                            }))
                          }
                          sx={{ background: "#fff", borderRadius: 1 }}
                        />
                        <Button
                          variant="contained"
                          disableElevation
                          onClick={() => handleAddComment(post._id)}
                          sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 1 }}
                        >
                          Post
                        </Button>
                      </Box>

                      <Box display="flex" flexDirection="column" gap={1.5}>
                        {(post.comments || []).length === 0 ? (
                          <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
                            No comments yet.
                          </Typography>
                        ) : (
                          (post.comments || []).map((c: any, i: number) => {
                            const commentOwner = typeof c.user === "string" ? "User" : c.user?.username;
                            return (
                              <Box key={c._id || i} display="flex" gap={1.5}>
                                <Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>
                                  {commentOwner?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ background: "#fff", p: 1.5, borderRadius: 2, flex: 1, border: "1px solid #eee" }}>
                                  <Typography variant="caption" fontWeight="bold" display="block" mb={0.5}>
                                    @{commentOwner}
                                  </Typography>
                                  <Typography variant="body2">
                                    {c.text}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })
                        )}
                      </Box>
                    </Box>
                  )}

                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </MainLayout>
  );
};

export default Profile;
