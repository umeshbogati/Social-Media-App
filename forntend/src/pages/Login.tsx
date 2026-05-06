import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { login as loginApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Alert } from "@mui/material";
import { AuthLayout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await loginApi({ email, password });

    console.log("LOGIN RESPONSE:", response);

    // ✅ NOW DIRECT ACCESS (NO .data.data)
    const { user, accessToken } = response;

    if (!user || !accessToken) {
      throw new Error("Invalid login response");
    }

    login(user, accessToken);

    navigate("/");
  } catch (err: any) {
    console.error("Login error:", err);

    setError(err.response?.data?.message || "Login failed");
  }
};
  return (
    <AuthLayout title="Login">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />

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

        <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
