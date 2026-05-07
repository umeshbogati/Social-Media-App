import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

// public routes that do not require authentication
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
// protected routes that require authentication
export const protectedRoutes = [
  {
    path: "/",
    element: <Home />,
  },
];

//default redirect for unmatched routes
export const defaultRedirect = "/login";

