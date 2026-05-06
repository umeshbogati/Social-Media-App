// filepath: src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, protectedRoutes, defaultRedirect } from "./routes";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";
import { useContext } from "react";
import { AuthContext, useAuth } from "../context/AuthContext";

const AppRouter = () => {
  const { loading } = useAuth();

  // 🔥 Prevent routing before auth is ready
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<PublicRoute>{route.element}</PublicRoute>}
          />
        ))}

        {/* Protected routes */}
        {protectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute>{route.element}</ProtectedRoute>}
          />
        ))}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;