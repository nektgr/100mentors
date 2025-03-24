import { useState } from 'react';
import { Button } from '../ui/Button';
import { usePosts, Post } from '../../context/PostsContext';
import { useAuth } from '../../context/AuthContext';

type PostItemProps = {
  post: Post;
};

export const PostItem = ({ post }: PostItemProps) => {
  const { deletePost } = usePosts();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const formattedDate = new Date(post.createdAt).toLocaleString();
  const isOwnPost = user?.id === post.userId;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        setIsDeleting(true);
        await deletePost(post.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white p-3 sm:p-4 rounded-md shadow mb-3 sm:mb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <h3 className="font-medium text-blue-600 text-sm sm:text-base">{post.author.name}</h3>
        <span className="text-xs text-gray-500 mt-1 sm:mt-0">{formattedDate}</span>
      </div>
      <p className="mt-2 text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">{post.content}</p>
      {isOwnPost && (
        <div className="mt-3 flex justify-end">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};
