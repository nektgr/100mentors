import { usePosts } from '../../context/PostsContext';
import { PostItem } from './PostItem';
import { Button } from '../ui/button';

export const PostsList = () => {
  const { posts, isLoading, error, refreshPosts } = usePosts();

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-mono-800 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-mono-700">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-mono-200 rounded-md">
        <p className="text-mono-700 mb-2">{error}</p>
        <Button onClick={refreshPosts} variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-8 bg-mono-200 rounded-md">
        <p className="text-mono-700">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button onClick={refreshPosts} variant="ghost" size="sm">
          Refresh
        </Button>
      </div>
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};
