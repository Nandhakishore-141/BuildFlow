import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';
import { NAV_ITEMS } from '@/constants';
import { cn } from '@/utils/cn';

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'glass shadow-sm border-b border-neutral-200/50 py-3'
            : 'bg-transparent py-5',
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-gold">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 20h20" />
                <path d="M5 20V8l7-5 7 5v12" />
                <path d="M10 20v-6h4v6" />
              </svg>
            </div>
            <span className="text-lg font-bold text-neutral-900 tracking-tight">
              Build<span className="gradient-gold-text">Flow</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3.5 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100/80 transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-semibold text-neutral-700">
                  Hi, {user.name.split(' ')[0]} <span className="text-xs px-2 py-0.5 rounded-full bg-gold-50 text-gold-600 border border-gold-200 ml-1">{user.role}</span>
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <HiOutlineX className="w-5 h-5" />
            ) : (
              <HiOutlineMenuAlt3 className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                  <span className="text-lg font-bold text-neutral-900 tracking-tight">
                    Build<span className="gradient-gold-text">Flow</span>
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100"
                  >
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                  <div className="flex flex-col gap-1">
                    {NAV_ITEMS.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-3 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="p-5 border-t border-neutral-100 flex flex-col gap-3">
                  {user ? (
                    <>
                      <div className="text-center text-sm font-semibold text-neutral-700 mb-2">
                        Hi, {user.name} <span className="text-xs px-2 py-0.5 rounded-full bg-gold-50 text-gold-600 border border-gold-200 ml-1">{user.role}</span>
                      </div>
                      <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full justify-center" onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>
                        Login
                      </Button>
                      <Button variant="primary" className="w-full justify-center" onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }}>
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
