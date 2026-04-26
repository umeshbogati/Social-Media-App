// filepath: src/components/Header/Header.tsx
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Header.css";

export const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-title">Social Media App</h1>
        <div className="header-user">
          {user && <span className="user-name">Welcome, {user.name}</span>}
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
