import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import API from "../api/axios";

/* ================= TYPES ================= */

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

/* ================= CONTEXT ================= */

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

/* ================= PROVIDER ================= */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= INIT AUTH ================= */

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);

        API.defaults.headers.common.Authorization =
          `Bearer ${storedToken}`;

        const res = await API.get("/auth/me");

        // ✅ FIX: safer extraction (prevents undefined crash)
        const userData =
          res?.data?.data?.user || res?.data?.user;

        if (!userData) throw new Error("No user found");

        setUser(userData);
      } catch (error) {
        console.log("❌ Token invalid or expired");
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /* ================= LOGIN ================= */

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);

    localStorage.setItem("token", token);

    API.defaults.headers.common.Authorization =
      `Bearer ${token}`;
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("token");

    delete API.defaults.headers.common.Authorization;
  };

  /* ================= VALUE ================= */

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout: handleLogout,

    // ✅ FIX: best practice auth check
    isAuthenticated: Boolean(token && user),
  };

  return (
    <AuthContext.Provider value={value}>
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