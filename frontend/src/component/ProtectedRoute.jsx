import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 *
 * Restricts access to authenticated users only.
 * Redirects unauthenticated users to login page.
 */
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;