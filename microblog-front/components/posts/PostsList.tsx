import { usePosts } from '../../context/PostsContext';
import { PostItem } from './PostItem';
import { Button } from '../ui/Button';

export const PostsList = () => {
  const { posts, isLoading, error, refreshPosts } = usePosts();

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-md">
        <p className="text-red-600 mb-2">{error}</p>
        <Button onClick={refreshPosts} variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-md">
        <p className="text-gray-600">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};
