import Head from 'next/head';
import { CreatePostForm } from '../components/posts/CreatePostForm';
import { PostsList } from '../components/posts/PostsList';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Remove console.log as it's not needed for production
  
  return (
    <>
      <Head>
        <title>MicroBlog - Home</title>
        <meta name="description" content="A simple micro-blogging platform" />
      </Head>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Posts Feed</h1>
        
        {!isLoading && isAuthenticated && <CreatePostForm />}
        
        <PostsList />
      </div>
    </>
  );
}
