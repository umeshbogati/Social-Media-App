import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";

import API from "../api/axios";

/* ================= USER TYPE ================= */

interface User {
  _id: string;
  username: string;
  name: string;
  email?: string;
  profilePicture?: string;
  role?: "user" | "admin";
}

/* ================= CONTEXT TYPE ================= */

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

/* ================= CONTEXT ================= */

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= INIT AUTH ================= */

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

  /* ================= LOGIN ================= */

  const login = (user: User, token: string) => {
    setUser(user);

    localStorage.setItem("token", token);

    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  /* ================= LOGOUT ================= */

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

  /* ================= UPDATE USER ================= */

  const updateUser = (updatedUser: User) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));
  };

  /* ================= VALUE ================= */

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

/* ================= HOOK ================= */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};