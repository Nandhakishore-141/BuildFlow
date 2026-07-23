import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export const PublicRoute = () => {
  const { user, accessToken, isInitialized, logout } = useAuthStore();

  useEffect(() => {
    // If a user is somehow authenticated but has an invalid role, forcefully log them out
    // to prevent getting stuck in a redirect loop.
    if (isInitialized && accessToken && user) {
      if (!['Contractor', 'Homeowner', 'Worker'].includes(user.role)) {
        logout();
      }
    }
  }, [isInitialized, accessToken, user, logout]);

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-50 gap-4">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-500 font-medium text-sm">Authenticating session...</p>
      </div>
    );
  }

  if (accessToken && user) {
    if (user.role === 'Contractor') return <Navigate to="/contractor/dashboard" replace />;
    if (user.role === 'Homeowner') return <Navigate to="/homeowner/dashboard" replace />;
    if (user.role === 'Worker') return <Navigate to="/worker/dashboard" replace />;
    
    // Fallback: If role is unrecognized, do not redirect to '/' (which causes a loop).
    // The useEffect above will log them out, so we render a loader in the meantime.
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-neutral-50 gap-4">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-500 font-medium text-sm">Invalid role. Logging out...</p>
      </div>
    );
  }

  return <Outlet />;
};
