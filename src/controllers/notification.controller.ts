import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../middlewares/auth.middleware';

class NotificationController {
  async getNotifications(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const notifications = await NotificationService.getNotifications(req.user!.id);
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async markAsRead(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const notification = await NotificationService.markAsRead(req.params.id, req.user!.id);
      return res.json(notification);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default new NotificationController();
