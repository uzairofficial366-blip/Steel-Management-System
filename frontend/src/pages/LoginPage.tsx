import { FormEvent, useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { roleDashboard } from "../lib/api";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) return <Navigate to={roleDashboard(user.role)} replace />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const path = await login(userId, password);
      navigate(path, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && !err.response) {
        setError("Backend is not reachable. Start the API server and try again.");
      } else if (axios.isAxiosError(err) && err.response?.status && err.response.status >= 500) {
        setError(err.response.data?.message || "Server setup error. Check backend database and API logs.");
      } else {
        setError("Wrong User ID or password");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-primary px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center text-2xl font-extrabold">
          Smart <span className="text-accent">Shop</span>
        </Link>
        <form onSubmit={onSubmit} className="card p-6 shadow-2xl sm:p-8">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-textMuted">Use your assigned role account to continue.</p>
          {error && <div className="mt-5 rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{error}</div>}
          <label className="mt-6 block text-sm font-medium">
            User ID
            <div className="relative mt-2">
              <User className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-textMuted" />
              <input className="input pl-10" value={userId} onChange={(event) => setUserId(event.target.value)} />
            </div>
          </label>
          <label className="mt-4 block text-sm font-medium">
            Password
            <div className="relative mt-2">
              <Lock className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-textMuted" />
              <input
                className="input pl-10 pr-11"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-textMuted hover:text-textPrimary"
                onClick={() => setShowPassword((value) => !value)}
                aria-label="Show password"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>
          <label className="mt-4 flex items-center gap-2 text-sm text-textMuted">
            <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />
            Show password
          </label>
          <button className="btn-primary mt-6 w-full" disabled={loading}>
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
