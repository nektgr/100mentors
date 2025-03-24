import Head from 'next/head';
import { CreatePostForm } from '../components/posts/CreatePostForm';
import { PostsList } from '../components/posts/PostsList';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <>
      <Head>
        <title>MicroBlog - Home</title>
        <meta name="description" content="A simple micro-blogging platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="w-full sm:max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Posts Feed</h1>
        
        {!isLoading && isAuthenticated && <CreatePostForm />}
        
        <PostsList />
      </div>
    </>
  );
}
