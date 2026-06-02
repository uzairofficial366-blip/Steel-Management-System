import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api, roleDashboard } from "../lib/api";
import type { User } from "../lib/types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userId: string, password: string) => Promise<string>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("smart_shop_token"));
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem("smart_shop_token");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      async login(userId, password) {
        const response = await api.post("/auth/login", { userId, password });
        localStorage.setItem("smart_shop_token", response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        toast.success(`Welcome, ${response.data.user.name}`);
        return roleDashboard(response.data.user.role);
      },
      logout() {
        localStorage.removeItem("smart_shop_token");
        setToken(null);
        setUser(null);
        toast.success("Logged out");
      },
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
