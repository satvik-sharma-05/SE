// src/api/auth.js
import api from "../services/api";

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.user || data;
};

export const logoutApi = async () => {
  const { data } = await api.get("/auth/logout");
  return data;
};

// OAuth redirects (backend handles redirect)
export const loginGoogleUrl = () =>
  (import.meta.env.VITE_API_BASE?.replace("/api", "") ||
    "http://localhost:5000") + "/api/auth/google";

export const loginGithubUrl = () =>
  (import.meta.env.VITE_API_BASE?.replace("/api", "") ||
    "http://localhost:5000") + "/api/auth/github";
