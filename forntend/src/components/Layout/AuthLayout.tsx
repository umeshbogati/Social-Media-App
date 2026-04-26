// filepath: src/components/Layout/AuthLayout.tsx
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./AuthLayout.css";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-brand">
          <h1 className="auth-title">Social Media App</h1>
          <p className="auth-subtitle">
            Connect with friends and share your moments
          </p>
        </div>
        <div className="auth-card">
          <h2 className="auth-card-title">{title}</h2>
          {children}
        </div>
        <div className="auth-footer">
          <p>
            {title === "Login" ? (
              <>
                Don't have an account? <Link to="/register">Register</Link>
              </>
            ) : (
              <>
                Already have an account? <Link to="/login">Log in</Link>
              </>
            )}
          </p>
        </div>
      </div>
      {/* <div className="auth-background">
        <div className="auth-bg-content">
          <h2>Welcome to Our Community</h2>
          <p>Share photos, connect with friends, and discover new content.</p>
        </div>
      </div> */}
    </div>
  );
};

export default AuthLayout;
