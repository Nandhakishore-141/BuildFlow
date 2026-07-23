import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard
    if (user.role === 'Contractor') return <Navigate to="/contractor/dashboard" replace />;
    if (user.role === 'Homeowner') return <Navigate to="/homeowner/dashboard" replace />;
    if (user.role === 'Worker') return <Navigate to="/worker/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
