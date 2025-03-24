import { render, screen, waitFor } from '@testing-library/react';
import { PostsProvider, usePosts } from '../../context/PostsContext';
import { postsAPI } from '../../service/apiService';
import { mockPosts } from '../utils/test-utils';
import { AllTheProviders } from '../utils/test-utils';

// Mock the API service
jest.mock('../../service/apiService');

// Test component that uses the posts context
const TestComponent = () => {
  const { posts, isLoading, error } = usePosts();
  
  return (
    <div>
      <div data-testid="loading-state">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="error-state">{error || 'No Error'}</div>
      <div data-testid="posts-count">{posts.length}</div>
    </div>
  );
};

describe('PostsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (postsAPI.getPosts as jest.Mock).mockResolvedValue([]);
  });

  test('basic context setup works', async () => {
    render(
      <AllTheProviders>
        <TestComponent />
      </AllTheProviders>
    );

    // Just verify the component renders without errors
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });
});
