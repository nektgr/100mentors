#!/bin/bash

echo "Checking project structure..."

# Check for conflicting router approaches in frontend
if [ -d "./microblog-front/app" ]; then
  echo "Found app directory in Next.js project - removing it"
  rm -rf ./microblog-front/app
  echo "App directory removed successfully"
fi

# Ensure page files exist
if [ ! -f "./microblog-front/pages/index.tsx" ]; then
  echo "Missing pages/index.tsx file - creating a basic one"
  
  mkdir -p ./microblog-front/pages
  
  cat > ./microblog-front/pages/index.tsx << 'EOF'
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

if [ ! -f "./microblog-front/pages/_app.tsx" ]; then
  echo "Missing pages/_app.tsx file - creating one"
  
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
  echo "Created _app.tsx file"
fi

# Ensure critical directories exist
mkdir -p ./microblog-front/components
mkdir -p ./microblog-front/context
mkdir -p ./microblog-front/styles

# Create empty globals.css if it doesn't exist
if [ ! -f "./microblog-front/styles/globals.css" ]; then
  echo "Creating empty globals.css"
  touch ./microblog-front/styles/globals.css
fi

echo "Project structure check complete!"
