import { Navigate, Outlet, useLocation } from "react-router-dom";
import { roleDashboard } from "../lib/api";
import type { Role } from "../lib/types";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-primary text-textMuted">Loading workspace...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={roleDashboard(user.role)} replace />;
  }

  return <Outlet />;
}
