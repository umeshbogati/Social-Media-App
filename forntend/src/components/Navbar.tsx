import { Link } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Social App</Link>
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <Link to="/">Home</Link>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
