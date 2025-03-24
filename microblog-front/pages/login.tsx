import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    router.push('/');
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    // Only accept test users to avoid authentication failures
    const validTestUsers = ['alice@example.com', 'bob@example.com'];
    if (!validTestUsers.includes(email)) {
      setError('Please use one of the test users: alice@example.com or bob@example.com');
      return;
    }
    
    try {
      await login(email);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email and try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Login - MicroBlog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div className="w-full max-w-xs sm:max-w-md mx-auto bg-mono-50 p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-mono-900">Login</h1>
        
        {error && (
          <div className="bg-mono-200 text-mono-800 p-2 sm:p-3 rounded mb-3 sm:mb-4 text-xs sm:text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-mono-800 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-mono-300 rounded-md focus:outline-none focus:ring-mono-600 focus:border-mono-600 bg-mono-50 text-mono-800"
              placeholder="Enter your email"
            />
            <p className="mt-2 text-xs text-mono-500">
              Use test emails: alice@example.com or bob@example.com
            </p>
          </div>
          
          <div className="mt-4 sm:mt-6">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
