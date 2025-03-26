const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Fetch wrapper with auth token
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized specifically to clear token
    if (response.status === 401) {
      localStorage.removeItem('token');
      throw new Error('Authentication failed. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email: string) => 
    fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
    
  getProfile: () => fetchWithAuth('/api/auth/profile'),
};

// Posts API
export const postsAPI = {
  getPosts: () => fetchWithAuth('/api/posts'),
  
  createPost: (content: string) => 
    fetchWithAuth('/api/posts', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
    
  deletePost: (id: number) => 
    fetchWithAuth(`/api/posts/${id}`, {
      method: 'DELETE',
    }),
};