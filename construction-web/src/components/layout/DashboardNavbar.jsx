import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Menu, Bell, ChevronDown, LogOut, User, Undo2, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export const DashboardNavbar = ({ onMenuClick }) => {
  const { user, logout, isImpersonating, stopImpersonation } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReturnToAdmin = async () => {
    const res = await stopImpersonation();
    if (res.success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <header className="h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-400 capitalize">{user?.role} Dashboard</span>
          
          {isImpersonating && (
            <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-600 text-white rounded-full flex items-center gap-1 uppercase tracking-wider animate-pulse shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              IMPERSONATING
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {isImpersonating && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReturnToAdmin}
            className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/30 font-bold gap-1 text-xs"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Return to Admin
          </Button>
        )}

        <button className="relative p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full border-2 border-zinc-950"></span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-zinc-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-zinc-100 leading-tight">{user?.name}</p>
              <p className="text-xs text-zinc-500">{user?.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500 hidden md:block" />
          </button>

          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/40 z-50 py-1 overflow-hidden">
                <div className="px-4 py-2 border-b border-zinc-800 mb-1 md:hidden">
                  <p className="text-sm font-bold text-zinc-100">{user?.name}</p>
                  <p className="text-xs text-zinc-500">{user?.email}</p>
                </div>
                
                <Link 
                  to={user ? `/${user.role.toLowerCase()}/settings` : '#'}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                
                {isImpersonating && (
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleReturnToAdmin();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors font-bold border-t border-zinc-800"
                  >
                    <Undo2 className="w-4 h-4" />
                    Return to Admin
                  </button>
                )}

                <div className="h-px bg-zinc-800 my-1"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium"
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
