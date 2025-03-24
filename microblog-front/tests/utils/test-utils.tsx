import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';
import { PostsProvider } from '../../context/PostsContext';
import { SocketProvider } from '../../context/SocketContext';

// Mock data
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
};

export const mockPost = {
  id: 1,
  content: 'This is a test post',
  createdAt: '2023-01-01T00:00:00Z',
  userId: 1,
  author: {
    name: 'Test User',
  },
};

export const mockPosts = [
  mockPost,
  {
    id: 2,
    content: 'This is another test post',
    createdAt: '2023-01-02T00:00:00Z',
    userId: 2,
    author: {
      name: 'Another User',
    },
  },
];

// Create a wrapper with all providers
export const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <SocketProvider>
        <PostsProvider>
          {children}
        </PostsProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

// Custom render function that includes our providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { customRender as render };
