import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';

export default function Navbar({ activePage }: { activePage?: string }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = {
    admin: [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Users', path: '/admin/users' },
      { name: 'Analytics', path: '/admin/analytics' },
      { name: 'Settings', path: '/admin/settings' },
    ],
    coordinator: [
      { name: 'Dashboard', path: '/coordinator' },
      { name: 'Calendar', path: '/coordinator/calendar' },
      { name: 'Events', path: '/coordinator/events' },
      { name: 'Enquiries', path: '/coordinator/enquiries' },
      { name: 'Vendors', path: '/coordinator/vendors' },
    ],
    client: [
      { name: 'Dashboard', path: '/client' },
      { name: 'My Events', path: '/client/events' },
      { name: 'Proposals', path: '/client/proposals' },
      { name: 'Invoices', path: '/client/invoices' },
    ],
    finance: [
      { name: 'Dashboard', path: '/finance' },
      { name: 'Invoices', path: '/finance/invoices' },
      { name: 'Payments', path: '/finance/payments' },
    ],
    operations: [
      { name: 'Dashboard', path: '/operations' },
    ],
  };

  const role = user?.role?.toLowerCase() || 'client';
  const items = navItems[role as keyof typeof navItems] || navItems.client;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={`/${role}`} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VenueOS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}