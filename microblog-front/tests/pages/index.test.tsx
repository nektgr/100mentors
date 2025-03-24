import { render, screen } from '@testing-library/react';
import Home from '../../pages/index';
import { useAuth } from '../../context/AuthContext';

// Mock the components used by the Home page
jest.mock('../../components/posts/CreatePostForm', () => ({
  CreatePostForm: () => <div data-testid="create-post-form">Create Post Form</div>
}));

jest.mock('../../components/posts/PostsList', () => ({
  PostsList: () => <div data-testid="posts-list">Posts List</div>
}));

// Mock the auth context
jest.mock('../../context/AuthContext');
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('Home Page - Basic', () => {
  test('minimal test to validate setup', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn()
    });

    // Just testing render succeeds
    const result = render(<Home />);
    expect(result).toBeTruthy();
  });
});
