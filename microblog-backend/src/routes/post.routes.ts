import { Router } from 'express';
import { getPosts, createPost, deletePost } from '../controllers/post.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Public route - get all posts
router.get('/', getPosts);

// Protected routes
router.post('/', authenticateToken, createPost);
router.delete('/:id', authenticateToken, deletePost);

export { router as postRouter };