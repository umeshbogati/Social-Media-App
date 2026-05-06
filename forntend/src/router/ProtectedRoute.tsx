import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/* ================= PROTECTED ROUTE ================= */

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ wait until auth is ready
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // 🚫 not logged in → redirect
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
};

/* ================= PUBLIC ROUTE ================= */

export const PublicRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // 🚫 already logged in → redirect home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};