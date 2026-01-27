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

// ✅ OAuth redirects (backend handles redirect)
const BACKEND_BASE =
  import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
    : import.meta.env.DEV
    ? "http://localhost:5000"
    : "";

export const loginGoogleUrl = () =>
  `${BACKEND_BASE}/api/auth/google`;

export const loginGithubUrl = () =>
  `${BACKEND_BASE}/api/auth/github`;
