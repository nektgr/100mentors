import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { postsAPI } from '../service/apiService';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

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
  const { socket, isConnected } = useSocket();

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
      
      // Only update local state if we're not connected via socket
      if (!isConnected) {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }
      
      return newPost;
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
      throw err;
    }
  };

  const deletePost = async (id: number) => {
    try {
      setError(null);
      await postsAPI.deletePost(id);
      
      // Only update local state if we're not connected via socket
      if (!isConnected) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      }
    } catch (err) {
      setError('Failed to delete post');
      console.error(err);
      throw err;
    }
  };

  // Load posts when component mounts or when auth state changes
  useEffect(() => {
    refreshPosts();
    
    // Set up a polling mechanism as fallback if sockets are not working
    const interval = setInterval(() => {
      if (!isConnected) {
        console.log('Socket not connected, refreshing posts via polling');
        refreshPosts();
      }
    }, 30000);  // Every 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Handle new post created
    const handleNewPost = (newPost: Post) => {
      console.log('Socket: New post received', newPost);
      setPosts(prevPosts => {
        // Check if post already exists (prevent duplicates)
        const exists = prevPosts.some(p => p.id === newPost.id);
        if (exists) return prevPosts;
        return [newPost, ...prevPosts];
      });
    };
    
    // Handle post deleted
    const handleDeletePost = (deletedPostId: number) => {
      console.log('Socket: Post deleted', deletedPostId);
      setPosts(prevPosts => 
        prevPosts.filter(post => post.id !== deletedPostId)
      );
    };

    // Register event listeners
    socket.on('post:created', handleNewPost);
    socket.on('post:deleted', handleDeletePost);

    // Cleanup function
    return () => {
      socket.off('post:created', handleNewPost);
      socket.off('post:deleted', handleDeletePost);
    };
  }, [socket]);

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
