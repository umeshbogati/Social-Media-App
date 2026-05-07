import API from "./axios";

// TYPES

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
// Response from backend after successful auth

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
// API response format
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Register

export const register = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const res = await API.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    data
  );

  return res.data.data;
};

//Login 

export const login = async (
  data: LoginData
): Promise<AuthResponse> => {
  const res = await API.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    data
  );

  return res.data.data;
};