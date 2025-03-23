import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

// Get all posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch posts' });
  }
};

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  const { content } = req.body;
  const userId = req.user?.id;
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }
  
  try {
    const post = await prisma.post.create({
      data: {
        content,
        userId: Number(userId),
      },
      include: {
        author: {
          select: { name: true }
        }
      }
    });
    
    // Emit new post to all connected clients
    const io: Server = req.app.get('io');
    io.emit('post:created', post);
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create post' });
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
  const postId = Number(req.params.id);
  const userId = req.user?.id;
  
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (post.userId !== Number(userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    await prisma.post.delete({ where: { id: postId } });
    
    // Emit post deletion to all connected clients
    const io: Server = req.app.get('io');
    io.emit('post:deleted', postId);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete post' });
  }
};