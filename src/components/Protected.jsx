import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { hasAnyRole } from "../utils/roles";
import Loader from "./Loader";

export default function Protected({ roles }) {
  const { user, role, loading } = useAuth() || {};
  const location = useLocation();

  // Check if auth context is available
  if (!user && loading === undefined) {
    console.error("Protected component must be used within AuthProvider");
    return <Navigate to="/login" replace />;
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !hasAnyRole(role, roles)) return <Navigate to="/" replace />;

  return <Outlet />;
}
