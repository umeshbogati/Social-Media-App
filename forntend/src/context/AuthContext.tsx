import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";

import API from "../api/axios";

// User type

interface User {
  _id: string;
  username: string;
  name: string;
  email?: string;
  profilePicture?: string;
  role?: "user" | "admin";
}

// Auth context type

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

// Create context

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Provider component

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on app load

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        API.defaults.headers.common.Authorization = `Bearer ${token}`;

        const res = await API.get<{ user: User }>("/auth/me");

        setUser(res.data.user);
      } catch (error) {
        console.error("Auth error:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login

  const login = (user: User, token: string) => {
    setUser(user);

    localStorage.setItem("token", token);

    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

//Logout
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {
      // ignore error
    }

    setUser(null);
    localStorage.removeItem("token");

    delete API.defaults.headers.common.Authorization;
  };

// Update user
  const updateUser = (updatedUser: User) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};