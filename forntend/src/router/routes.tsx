// filepath: src/router/routes.tsx
import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Public routes that don't require authentication
export const publicRoutes = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
];

// Protected routes that require authentication
export const protectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "/home", element: <Home /> },
];

// Default redirect
export const defaultRedirect = "/";
