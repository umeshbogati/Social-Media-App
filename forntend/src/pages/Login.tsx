import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";

import { login as loginApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

/* ================= TYPES ================= */

interface LoginResponse {
  user: {
    _id: string;
    username: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  accessToken: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  /* ================= LOGIN ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginApi({ email, password });

      const user = response.user;
      const accessToken = response.accessToken;

      if (!user || !accessToken) {
        throw new Error("Invalid login response");
      }

      login(user, accessToken);
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", err);

      const message =
        err?.response?.data?.message || err?.message || "Login failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login">
      {/* ERROR */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* EMAIL */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />

        {/* PASSWORD */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((p) => !p)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* BUTTON */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={22} /> : "Login"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
