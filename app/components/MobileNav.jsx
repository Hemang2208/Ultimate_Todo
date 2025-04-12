import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User, Settings, Moon, Sun } from 'lucide-react';
import { routes } from '../config/routes';

const MobileNav = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const mobileNav = document.querySelector('.mobile-nav-content');
      if (isOpen && mobileNav && !mobileNav.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const body = document.body;

    if (isOpen) {
      const scrollY = window.scrollY;
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
    } else {
      const scrollY = parseInt(body.style.top || '0', 10) * -1;
      body.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      window.scrollTo(0, scrollY);
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push(routes.auth.login);
  };

  return (
    <div className="block md:hidden">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="mobile-nav-content h-full overflow-y-auto">
          <div className="p-4 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-violet-900 dark:text-violet-400">Ultimate Todo</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push(routes.auth.profile);
                }}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  toggleDarkMode();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push('/settings');
                }}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
