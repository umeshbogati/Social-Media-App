import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getPosts,
  createPost,
  likePost,
  deletePost,
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
} from "@mui/material";
import { Favorite, Delete, AddPhotoAlternate } from "@mui/icons-material";

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const newPosts = await getPosts(page);
      if (page === 1) {
        setPosts(newPosts || []);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...(newPosts || [])]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPost({ description, image: image || undefined });
      setDescription("");
      setImage(null);
      setPage(1);
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    const post = posts.find((p) => p._id === postId);
    if (!post) return;

    const isLiked = post.likes.includes(user?._id || "");

    try {
      await likePost(postId);
      setPosts(
        posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: isLiked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user?._id || ""],
              }
            : p,
        ),
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {/* Create Post Card */}
        <Card sx={{ mb: 3, p: 2 }}>
          <form onSubmit={handleCreatePost}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What's on your mind?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                <IconButton component="span">
                  <AddPhotoAlternate />
                </IconButton>
              </label>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Posting..." : "Post"}
              </Button>
            </Box>
            {image && <Typography variant="caption">{image.name}</Typography>}
          </form>
        </Card>

        {/* Posts Feed */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          posts.map((post) => (
            <Card key={post._id} sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.userId?.username || "Unknown"}
                  </Typography>
                  {post.userId?._id === user?._id && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(post._id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {post.description}
                </Typography>
                {post.image && (
                  <CardMedia
                    component="img"
                    image={post.image}
                    alt="Post"
                    sx={{ borderRadius: 1, mb: 2 }}
                  />
                )}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    color={
                      post.likes.includes(user?._id || "") ? "error" : "default"
                    }
                    onClick={() => handleLike(post._id)}
                  >
                    <Favorite />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {post.likes.length} likes
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))
        )}

        {/* Load More */}
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Button variant="outlined" onClick={() => setPage(page + 1)}>
            Load More
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Home;
