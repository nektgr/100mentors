import { render, screen, fireEvent } from '@testing-library/react';
import { PostItem } from '../../../components/posts/PostItem';
import { mockPost } from '../../utils/test-utils';
import { useAuth } from '../../../context/AuthContext';
import { usePosts } from '../../../context/PostsContext';

// Mock the contexts
jest.mock('../../../context/AuthContext');
jest.mock('../../../context/PostsContext');

// Create a mock for Button explicitly
jest.mock('../../../components/ui/button', () => ({
  Button: ({ children, onClick, variant }) => (
    <button 
      data-testid="mocked-button" 
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  )
}));

// Mock window.confirm
global.confirm = jest.fn();

describe('PostItem Component', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const mockUsePosts = usePosts as jest.MockedFunction<typeof usePosts>;
  
  const mockDeletePost = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.confirm as jest.Mock).mockReturnValue(true);
    
    mockUsePosts.mockReturnValue({
      posts: [],
      isLoading: false,
      error: null,
      refreshPosts: jest.fn(),
      createPost: jest.fn(),
      deletePost: mockDeletePost,
    });

    // Default auth state - not the post author
    mockUseAuth.mockReturnValue({
      user: { id: 999, name: 'Other User', email: 'other@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });
  });

  test('does not show delete button for other users posts', () => {
    render(<PostItem post={mockPost} />);
    const deleteButton = screen.queryByTestId('mocked-button');
    expect(deleteButton).not.toBeInTheDocument();
  });
});
