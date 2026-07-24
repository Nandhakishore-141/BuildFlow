import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Undo2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const ImpersonationBanner = () => {
  const { user, isImpersonating, stopImpersonation } = useAuthStore();
  const navigate = useNavigate();

  if (!isImpersonating || !user) return null;

  const handleReturnToAdmin = async () => {
    const res = await stopImpersonation();
    if (res.success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="bg-rose-900 text-white px-4 py-2.5 shadow-md flex items-center justify-between z-50 border-b border-rose-800 text-xs md:text-sm font-medium">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-rose-800 rounded-full flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-300 animate-pulse" />
        </div>
        <div>
          <span className="font-bold text-amber-200">You are currently impersonating: </span>
          <span className="font-extrabold text-white">{user.name}</span>{' '}
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-rose-800 text-rose-100 font-bold border border-rose-700 uppercase tracking-wider ml-1">
            {user.role}
          </span>
          <span className="hidden md:inline text-rose-200 ml-2">
            — Actions performed will affect this account.
          </span>
        </div>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleReturnToAdmin}
        className="bg-white text-rose-900 hover:bg-rose-50 border-white font-bold gap-1.5 shrink-0 shadow-xs text-xs"
      >
        <Undo2 className="w-3.5 h-3.5" />
        Return to Admin
      </Button>
    </div>
  );
};
