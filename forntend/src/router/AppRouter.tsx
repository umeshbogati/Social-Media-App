import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  publicRoutes,
  protectedRoutes,
  defaultRedirect,
} from "./routes";

import {
  ProtectedRoute,
  PublicRoute,
} from "./ProtectedRoute";

import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

const AppRouter = () => {
  const { loading } = useAuth();

  /* ================= GLOBAL LOADING ================= */
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PublicRoute>
                {route.element}
              </PublicRoute>
            }
          />
        ))}

        {/* ================= PROTECTED ROUTES ================= */}
        {protectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* ================= FALLBACK ================= */}
        <Route
          path="*"
          element={
            <Navigate
              to={defaultRedirect}
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;