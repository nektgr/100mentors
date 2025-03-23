import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { authRouter } from './routes/auth.routes';
import { postRouter } from './routes/post.routes';

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup Socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

// Make io accessible to other modules
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Default route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Microblog API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
