import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

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
      </Head>
      
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
            <p className="mt-2 text-xs text-gray-500">
              Use test emails: alice@example.com or bob@example.com
            </p>
          </div>
          
          <div className="mt-6">
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
}
