import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../service/apiService';

/**
 * User interface representing authenticated user data
 * @interface User
 */
type User = {
  id: number;
  name: string;
  email: string;
};

/**
 * Authentication context interface
 * @interface AuthContextType
 */
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component
 * Manages authentication state and provides login/logout functionality
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthProvider component
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await authAPI.getProfile();
            setUser(userData);
          } catch (error) {
            // Token invalid or expired
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        // Authentication check failed
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Authenticates a user with their email
   * @param {string} email - User's email address
   * @returns {Promise<void>}
   * @throws {Error} When authentication fails
   */
  const login = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await authAPI.login(email);
      localStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logs out the current user
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access the authentication context
 * @returns {AuthContextType} Authentication context
 * @throws {Error} When used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
