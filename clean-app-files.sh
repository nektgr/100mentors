#!/bin/bash

# Check if app directory exists in microblog-front
if [ -d "./microblog-front/app" ]; then
  echo "Found app directory in microblog-front, removing it"
  rm -rf ./microblog-front/app
  echo "App directory removed"
fi

# Create simple placeholder index file if needed
if [ ! -f "./microblog-front/pages/index.tsx" ]; then
  echo "Creating basic index.tsx file"
  cat > ./microblog-front/pages/index.tsx << 'EOF'
import { useEffect } from 'react';
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
      </Head>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Posts Feed</h1>
        
        {!isLoading && isAuthenticated && <CreatePostForm />}
        
        <PostsList />
      </div>
    </>
  );
}
EOF
  echo "Created index.tsx file"
fi

echo "Done!"
