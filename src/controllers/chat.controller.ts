import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';
import { Schema } from 'mongoose';
import { AuthRequest } from '../middlewares/auth.middleware';

class ChatController {
  async getMessages(req: Request, res: Response): Promise<Response> {
    try {
      const messages = await ChatService.getMessages(req.params.id as unknown as Schema.Types.ObjectId);
      return res.json(messages);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async sendMessage(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { content } = req.body;
      const message = await ChatService.sendMessage(
        req.user!.id as unknown as Schema.Types.ObjectId,
        req.params.id as unknown as Schema.Types.ObjectId,
        content
      );
      req.io.of(`/chat/${req.params.id}`).emit('newMessage', message);
      return res.status(201).json(message);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteMessage(req: AuthRequest, res: Response): Promise<Response> {
    try {
      await ChatService.deleteMessage(req.params.messageId, req.user!.id, req.user!.role);
      req.io.of(`/chat/${req.params.id}`).emit('deleteMessage', req.params.messageId);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new ChatController();
