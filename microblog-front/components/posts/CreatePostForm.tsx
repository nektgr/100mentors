import { useState } from 'react';
import { Button } from '../ui/Button';
import { usePosts } from '../../context/PostsContext';
import { useAuth } from '../../context/AuthContext';

export const CreatePostForm = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = usePosts();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    try {
      setIsSubmitting(true);
      await createPost(content);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white p-3 sm:p-4 rounded-md shadow mb-4 sm:mb-6">
      <h2 className="text-md sm:text-lg font-medium mb-2 sm:mb-4">Create a new post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
        />
        <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
            {content.length}/280 characters
          </div>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!content.trim() || content.length > 280}
            size="sm"
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};
