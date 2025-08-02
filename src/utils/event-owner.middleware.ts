import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import EventRepository from '../repositories/event.repository';

export const eventOwnerMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const event = await EventRepository.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  if (event.createdBy.toString() !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};
