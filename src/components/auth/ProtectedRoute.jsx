import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../ui/CenterLoading';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading message="Checking authentication..." />;
  }

  if (!user) {
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on their actual role if they try to access a route they aren't allowed to
    if (user.role === 'admin') {
      return <Navigate to="/admin/home" replace />;
    }
    return <Navigate to="/user/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
