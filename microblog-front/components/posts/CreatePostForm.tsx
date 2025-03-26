import { useState } from 'react';
import { usePosts } from '../../context/PostsContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';

/**
 * Component for creating new posts
 * Provides a form with text area input and character counter
 * @returns {JSX.Element} CreatePostForm component
 */
export const CreatePostForm = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = usePosts();
  const { isAuthenticated } = useAuth();

  /**
   * Handles form submission for creating a new post
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || content.length > 280) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createPost(content);
      setContent('');
    } catch (error) {
      // Error is handled by the PostsContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-mono-50 border border-mono-200 rounded-lg p-3 sm:p-4 mb-6">
      <h2 className="text-lg sm:text-xl font-medium mb-3 text-mono-900">Create Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 sm:p-3 border border-mono-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mono-600 bg-mono-50 text-mono-800"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
        />
        <div className="mt-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-xs sm:text-sm text-mono-500 order-2 sm:order-1">
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
