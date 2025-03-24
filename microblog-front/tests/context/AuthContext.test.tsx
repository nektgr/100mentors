import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { authAPI } from '../../service/apiService';

// Mock the API service
jest.mock('../../service/apiService', () => ({
  authAPI: {
    login: jest.fn(),
    getProfile: jest.fn(),
  },
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="auth-state">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      {user && (
        <div data-testid="user-info">
          {user.name} ({user.email})
        </div>
      )}
      <button onClick={() => login('test@example.com')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides authentication state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Just verify initial render works
    await waitFor(() => {
      expect(screen.getByTestId('auth-state').textContent).toBe('Not Authenticated');
    });
  });
});
