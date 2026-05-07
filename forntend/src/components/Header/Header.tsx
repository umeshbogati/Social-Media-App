import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";

export const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <AppBar position="sticky" sx={{ background: "#ffffff", color: "#333", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <Toolbar sx={{ maxWidth: 900, width: "100%", mx: "auto", display: "flex", justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          component={Link} 
          to="/" 
          sx={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}
        >
          <Box sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Social Media
          </Box>
        </Typography>

        {user && (
          <Box display="flex" alignItems="center" gap={1}>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              sx={{ 
                textTransform: "none", 
                fontWeight: "bold",
                color: location.pathname === "/" ? "#667eea" : "text.secondary",
                "&:hover": { backgroundColor: "rgba(102, 126, 234, 0.08)" }
              }}
            >
              Home
            </Button>
            
            <Button
              component={Link}
              to="/profile"
              startIcon={
                <Avatar src={user.profilePicture} sx={{ width: 24, height: 24, fontSize: 12 }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              }
              sx={{ 
                textTransform: "none", 
                fontWeight: "bold",
                color: location.pathname === "/profile" ? "#667eea" : "text.secondary",
                "&:hover": { backgroundColor: "rgba(102, 126, 234, 0.08)" }
              }}
            >
              Profile
            </Button>

            <Button
              onClick={logout}
              startIcon={<LogoutIcon />}
              sx={{ 
                textTransform: "none", 
                fontWeight: "bold", 
                color: "#ef4444",
                "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.08)" }
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
