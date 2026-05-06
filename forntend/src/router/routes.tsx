import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

/* ================= PUBLIC ROUTES ================= */
export const publicRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];

/* ================= PROTECTED ROUTES ================= */
export const protectedRoutes = [
  {
    path: "/",
    element: <Home />,
  },
];

/* ================= DEFAULT REDIRECT ================= */
export const defaultRedirect = "/";