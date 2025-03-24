import { render, screen } from '@testing-library/react';
import { Header } from '../../../components/layout/Header';
import { useAuth } from '../../../context/AuthContext';

// Mock the auth context
jest.mock('../../../context/AuthContext');

describe('Header Component', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders logo with correct link', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<Header />);
    
    const logo = screen.getByText(/microblog/i);
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  test('shows login button when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<Header />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    
    const welcomeMessage = screen.queryByText(/welcome/i);
    expect(welcomeMessage).not.toBeInTheDocument();
  });

  test('shows welcome message and logout button when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(<Header />);
    
    const welcomeMessage = screen.getByText(/welcome, test user/i);
    expect(welcomeMessage).toBeInTheDocument();
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    
    const loginButton = screen.queryByRole('button', { name: /login/i });
    expect(loginButton).not.toBeInTheDocument();
  });

  test('calls logout function when logout button is clicked', () => {
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: mockLogout,
    });

    render(<Header />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    logoutButton.click();
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
