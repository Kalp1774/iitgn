import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/employees', label: 'Employees' },
    { path: '/attendance', label: 'Attendance' },
    { path: '/payroll', label: 'Payroll' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <nav className="bg-white shadow-sm border-b" style={{ borderBottomColor: '#E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-10">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105" style={{ backgroundColor: '#875A7B' }}>
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-bold" style={{ color: '#875A7B' }}>
                  HRMS
                </span>
              </Link>
              <div className="flex space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.path
                        ? 'text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    style={
                      location.pathname === link.path
                        ? { backgroundColor: '#875A7B' }
                        : {}
                    }
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500 uppercase">{user?.role}</div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: '#dc3545' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-8">{children}</main>
    </div>
  );
};

export default Layout;

