import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children, adminOnly = false }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
