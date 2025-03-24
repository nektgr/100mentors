import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Connecting to socket server at:', apiUrl);
    
    // Create socket instance
    const socketInstance = io(apiUrl, {
      reconnectionAttempts: 3,
      reconnectionDelay: 5000,
      timeout: 10000
    });

    // Socket event handlers
    const onConnect = () => {
      console.log('Socket connected!');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Socket disconnected!');
      setIsConnected(false);
    };

    const onError = (error: Error) => {
      console.error('Socket error:', error);
    };

    // Register event handlers
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    socketInstance.on('connect_error', onError);

    // Store socket in state
    setSocket(socketInstance);

    // Cleanup function
    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
      socketInstance.off('connect_error', onError);
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
