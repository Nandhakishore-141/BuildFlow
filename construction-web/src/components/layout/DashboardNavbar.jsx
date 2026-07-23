import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Menu, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DashboardNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-neutral-500 hover:bg-neutral-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Placeholder for Breadcrumbs */}
        <div className="hidden md:block">
          <span className="text-sm font-medium text-neutral-500 capitalize">{user?.role} Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button className="relative p-2 text-neutral-500 hover:bg-neutral-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-200 flex items-center justify-center text-gold-700 font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-neutral-900 leading-tight">{user?.name}</p>
              <p className="text-xs text-neutral-500">{user?.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                <div className="px-4 py-2 border-b border-neutral-100 mb-1 md:hidden">
                  <p className="text-sm font-bold text-neutral-900">{user?.name}</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                </div>
                
                <Link 
                  to={user ? `/${user.role.toLowerCase()}/settings` : '#'}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                
                <div className="h-px bg-neutral-100 my-1"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
