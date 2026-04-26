// filepath: src/config/api.ts
import { API_BASE_URL } from "../constants";

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Axios instance configuration
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // Response interceptor for handling errors globally
  validateStatus: (status: number) => {
    return status >= 200 && status < 300;
  },
};
