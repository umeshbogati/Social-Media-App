import type { ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useContext } from "react";
import {
  AuthProvider,
  AuthContext,
} from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

/* ================= PRIVATE ROUTE ================= */
const PrivateRoute = ({
  children,
}: {
  children: ReactNode;
}) => {
  const context = useContext(AuthContext);

  if (!context) {
    return <Navigate to="/login" replace />;
  }

  const { isAuthenticated, loading } = context;

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

/* ================= APP ================= */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />

          {/* PROTECTED ROUTES */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* 404 ROUTE */}
          <Route
            path="*"
            element={
              <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-4xl font-bold text-gray-800">
                  404
                </h1>
                <p className="text-gray-500 mt-2">
                  Page not found
                </p>
                <button
                  onClick={() =>
                    (window.location.href = "/")
                  }
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Go Home
                </button>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;