import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle numeric roles: 0=CREATOR, 1=FREELANCER, 2=ADMIN
  if (role) {
    const userRoleString = 
      user.role === 0 ? "CREATOR" :
      user.role === 1 ? "FREELANCER" :
      user.role === 2 ? "ADMIN" : user.role;
    
    if (userRoleString !== role) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
