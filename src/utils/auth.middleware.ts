import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';

declare global {
  namespace Express {
    interface Request {
      io: Server;
    }
  }
}

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

import { env } from '../config/env.config';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
