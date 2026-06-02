import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smart_shop_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function money(value: string | number | null | undefined) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(value || 0));
}

export function roleDashboard(role: string) {
  const rolePath = role.toLowerCase();
  return `/${rolePath}/dashboard`;
}
