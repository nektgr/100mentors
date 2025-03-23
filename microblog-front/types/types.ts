export interface User {
    id: number;
    name: string;
    email: string;
  }
  
  export interface Post {
    id: number;
    content: string;
    createdAt: string;
    userId: number;
    author: {
      name: string;
    };
  }