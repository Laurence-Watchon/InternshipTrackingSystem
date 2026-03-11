import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../ui/CenterLoading';

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Checking session..." />;
  }

  if (user) {
    // Redirect to their respective home based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin/home" replace />;
    }
    return <Navigate to="/user/home" replace />;
  }

  return children;
};

export default PublicRoute;
