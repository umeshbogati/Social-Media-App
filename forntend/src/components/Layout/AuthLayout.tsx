import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Box, Paper, Typography} from "@mui/material";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        px: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        {/* BRAND */}
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          color="primary"
        >
          Social Media App
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Connect with friends and share your moments
        </Typography>

        {/* TITLE */}
        <Typography variant="h6" fontWeight={600} mb={2}>
          {title}
        </Typography>

        {/* FORM */}
        <Box>{children}</Box>

        {/* FOOTER */}
        <Box mt={3}>
          <Typography variant="body2">
            {title === "Login" ? (
              <>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    fontWeight: 600,
                    color: "#1976d2",
                  }}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    fontWeight: 600,
                    color: "#1976d2",
                  }}
                >
                  Login
                </Link>
              </>
            )}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthLayout;