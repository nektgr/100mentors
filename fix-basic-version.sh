#!/bin/bash

echo "Creating a basic version without socket.io dependencies"

# Update backend files to remove socket.io references
cat > ./microblog-backend/src/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes';
import { postRouter } from './routes/post.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Default route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Microblog API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
EOF

# Update frontend files to remove socket.io references
cat > ./microblog-front/pages/_app.tsx << 'EOF'
import { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { PostsProvider } from '../context/PostsContext';
import { Layout } from '../components/layout/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PostsProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PostsProvider>
    </AuthProvider>
  );
}

export default MyApp;
EOF

cat > ./microblog-front/context/PostsContext.tsx << 'EOF'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { postsAPI } from '../service/apiService';
import { useAuth } from './AuthContext';

export type Post = {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  author: {
    name: string;
  };
};

type PostsContextType = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  createPost: (content: string) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await postsAPI.getPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (content: string) => {
    try {
      setError(null);
      const newPost = await postsAPI.createPost(content);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    }
  };

  const deletePost = async (id: number) => {
    try {
      setError(null);
      await postsAPI.deletePost(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
    }
  };

  // Load posts when component mounts or when auth state changes
  useEffect(() => {
    refreshPosts();
    // Set up a polling mechanism to refresh posts every 30 seconds
    const interval = setInterval(() => {
      refreshPosts();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        isLoading,
        error,
        refreshPosts,
        createPost,
        deletePost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};
EOF

echo "Stopping all containers..."
docker-compose down

echo "Rebuilding containers..."
docker-compose build

echo "Starting the application..."
docker-compose up
