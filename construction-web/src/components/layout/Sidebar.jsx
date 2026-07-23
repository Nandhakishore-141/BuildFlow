import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  ClipboardList, 
  Package, 
  Receipt, 
  LineChart, 
  Bell, 
  FileText, 
  Settings, 
  UserCircle,
  Upload,
  CalendarCheck,
  Activity,
  Megaphone,
  ShieldAlert
} from 'lucide-react';

const adminLinks = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Contractors', path: '/admin/contractors', icon: Briefcase },
  { name: 'Homeowners', path: '/admin/homeowners', icon: UserCircle },
  { name: 'Workers', path: '/admin/workers', icon: Users },
  { name: 'Projects', path: '/admin/projects', icon: Briefcase },
  { name: 'Reports', path: '/admin/reports', icon: FileText },
  { name: 'Analytics', path: '/admin/analytics', icon: Activity },
  { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  { name: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const contractorLinks = [
  { name: 'Dashboard', path: '/contractor/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/contractor/projects', icon: Briefcase },
  { name: 'Workers', path: '/contractor/workers', icon: Users },
  { name: 'Attendance', path: '/contractor/attendance', icon: ClipboardList },
  { name: 'Materials', path: '/contractor/materials', icon: Package },
  { name: 'Expenses', path: '/contractor/expenses', icon: Receipt },
  { name: 'Progress', path: '/contractor/progress', icon: LineChart },
  { name: 'Notifications', path: '/contractor/notifications', icon: Bell },
  { name: 'Reports', path: '/contractor/reports', icon: FileText },
  { name: 'Settings', path: '/contractor/settings', icon: Settings },
];

const homeownerLinks = [
  { name: 'Dashboard', path: '/homeowner/dashboard', icon: LayoutDashboard },
  { name: 'My Projects', path: '/homeowner/projects', icon: Briefcase },
  { name: 'Construction Progress', path: '/homeowner/progress', icon: LineChart },
  { name: 'Expenses', path: '/homeowner/expenses', icon: Receipt },
  { name: 'Documents', path: '/homeowner/documents', icon: FileText },
  { name: 'Notifications', path: '/homeowner/notifications', icon: Bell },
  { name: 'Settings', path: '/homeowner/settings', icon: Settings },
];

const workerLinks = [
  { name: 'Dashboard', path: '/worker/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', path: '/worker/profile', icon: UserCircle },
  { name: 'Assigned Projects', path: '/worker/projects', icon: Briefcase },
  { name: 'Upload Progress', path: '/worker/upload-progress', icon: Upload },
  { name: 'Attendance', path: '/worker/attendance', icon: CalendarCheck },
  { name: 'Notifications', path: '/worker/notifications', icon: Bell },
  { name: 'Settings', path: '/worker/settings', icon: Settings },
];

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  let links = [];
  if (user?.role === 'Admin') links = adminLinks;
  else if (user?.role === 'Contractor') links = contractorLinks;
  else if (user?.role === 'Homeowner') links = homeownerLinks;
  else if (user?.role === 'Worker') links = workerLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-neutral-900/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-neutral-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">C</span>
            </div>
            <span className="text-xl font-bold text-neutral-900 tracking-tight">ConstructIQ</span>
          </Link>
        </div>

        <div className="py-6 px-4 h-[calc(100vh-4rem)] overflow-y-auto">
          <p className="px-3 text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
            {user?.role} Menu
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-gold-50 text-gold-700' 
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-gold-600' : 'text-neutral-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
