import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ================= LOGIN ================= */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },

    /* ================= SET USER ================= */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    /* ================= LOADING ================= */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /* ================= ERROR ================= */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /* ================= HYDRATE (IMPORTANT) ================= */
    hydrateAuth: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    /* ================= LOGOUT ================= */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  setUser,
  setLoading,
  setError,
  logout,
  hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;