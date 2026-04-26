import API from "./axios";

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

export const register = async (data: RegisterData) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};
