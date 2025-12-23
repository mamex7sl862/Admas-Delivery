import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If route requires admin but user is not admin → redirect home
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" />;
  }

  // All good → render the page
  return children;
};

export default ProtectedRoute;
