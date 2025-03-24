import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600 mb-2 sm:mb-0">
          MicroBlog
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                Welcome, {user?.name}
              </span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
