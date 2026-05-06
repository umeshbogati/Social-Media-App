import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /* ================= NOT AUTHENTICATED ================= */
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  /* ================= ALLOW ================= */
  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  /* ================= AUTH CHECK ================= */
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  /* ================= ALLOW ================= */
  return <>{children}</>;
};
