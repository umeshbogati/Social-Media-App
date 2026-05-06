import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      {/* BRAND */}
      <div style={{ fontWeight: "bold" }}>
        <Link
          to="/"
          style={{ textDecoration: "none", color: "black" }}
        >
          Social App
        </Link>
      </div>

      {/* LINKS */}
      <div style={{ display: "flex", gap: "12px" }}>
        {isAuthenticated ? (
          <>
            <Link to="/" style={{ textDecoration: "none" }}>
              Home
            </Link>

            <Link to="/profile" style={{ textDecoration: "none" }}>
              Profile
            </Link>

            <button
              onClick={logout}
              style={{
                border: "none",
                background: "#ef4444",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none" }}>
              Login
            </Link>

            <Link to="/register" style={{ textDecoration: "none" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;