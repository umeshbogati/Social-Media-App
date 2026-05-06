import API from "./axios";

/* ================= TYPES ================= */

export interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/* ================= RESPONSE TYPES ================= */

export interface AuthResponse {
  user: {
    _id: string;
    username: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn?: string;
}

/* ================= WRAPPED BACKEND RESPONSE ================= */

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/* ================= REGISTER ================= */

export const register = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const response = await API.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    data
  );

  return response.data.data;
};

/* ================= LOGIN ================= */

export const login = async (
  data: LoginData
): Promise<AuthResponse> => {
  const response = await API.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    data
  );

  return response.data.data;
};