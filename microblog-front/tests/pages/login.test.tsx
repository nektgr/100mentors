import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../pages/login';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock the auth context
jest.mock('../../context/AuthContext');

describe('Login Page', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
  const mockLogin = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseRouter.mockReturnValue({
      push: mockPush,
      pathname: '/login',
      query: {},
      asPath: '',
      basePath: '',
      isLocaleDomain: false,
      isFallback: false,
      isReady: true,
      isPreview: false,
      events: { emit: jest.fn(), off: jest.fn(), on: jest.fn() },
      locale: undefined,
      locales: undefined,
      defaultLocale: undefined,
      domainLocales: undefined,
      prefetch: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      beforePopState: jest.fn(),
      reload: jest.fn(),
      forward: jest.fn(),
    });
    
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      logout: jest.fn()
    });
  });

  test('renders the login form', () => {
    render(<Login />);
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/use test emails/i)).toBeInTheDocument();
  });

  test('redirects if already authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: mockLogin,
      logout: jest.fn()
    });
    
    render(<Login />);
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  test('does not redirect if authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: mockLogin,
      logout: jest.fn()
    });
    
    render(<Login />);
    
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('shows error when submitting empty form', () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('shows error when submitting non-test email', () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/please use one of the test users/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test('calls login function with valid test email', async () => {
    mockLogin.mockResolvedValue(undefined);
    
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    fireEvent.click(submitButton);
    
    expect(mockLogin).toHaveBeenCalledWith('alice@example.com');
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  test('displays error message when login fails', async () => {
    mockLogin.mockRejectedValue(new Error('Login failed'));
    
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    fireEvent.click(submitButton);
    
    expect(mockLogin).toHaveBeenCalledWith('alice@example.com');
    
    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
    
    expect(mockPush).not.toHaveBeenCalled();
  });
});
