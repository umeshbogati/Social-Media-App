import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  getMyPosts,
  deletePost,
  updatePost,
  type Post,
} from "../api/posts";

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

import { Delete, Edit } from "@mui/icons-material";
import { MainLayout } from "../components/Layout";

const Profile = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // edit states
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  /* ================= FETCH POSTS ================= */
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

  /* ================= DELETE POST ================= */
  const handleDelete = async (postId: string) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await deletePost(postId);

      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ================= EDIT POST ================= */
  const handleUpdate = async (postId: string) => {
    try {
      const updated = await updatePost(postId, {
        description: editText,
      });

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? updated : p)),
      );

      setEditingPostId(null);
      setEditText("");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /* ================= UI ================= */
  return (
    <MainLayout>
      <Box sx={{ maxWidth: 600, mx: "auto", py: 3 }}>

        {/* USER INFO */}
        <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 70, height: 70 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h6">
                {user?.name}
              </Typography>

              <Typography color="text.secondary">
                @{user?.username}
              </Typography>

              <Typography color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* POSTS */}
        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography textAlign="center">
            No posts yet 🚀
          </Typography>
        ) : (
          posts.map((post) => (
            <Card
              key={post._id}
              sx={{ mb: 2, borderRadius: 3 }}
            >
              <CardContent>

                {/* HEADER */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontWeight="bold">
                    @{user?.username}
                  </Typography>

                  <Box>
                    {/* EDIT ICON */}
                    <IconButton
                      onClick={() => {
                        setEditingPostId(post._id);
                        setEditText(post.description);
                      }}
                    >
                      <Edit />
                    </IconButton>

                    {/* DELETE ICON */}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(post._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
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
                      sx={{ mt: 2 }}
                    />

                    <Box mt={1} display="flex" gap={1}>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleUpdate(post._id)
                        }
                      >
                        Save
                      </Button>

                      <Button
                        onClick={() =>
                          setEditingPostId(null)
                        }
                      >
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
                  <img
                    src={post.image}
                    alt="post"
                    style={{
                      width: "100%",
                      borderRadius: 10,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </MainLayout>
  );
};

export default Profile;