import { Request, Response } from 'express';
import SendMessageUseCase from '../use-cases/chat/send-message.usecase';
import DeleteMessageUseCase from '../use-cases/chat/delete-message.usecase';
import GetMessagesUseCase from '../use-cases/chat/get-messages.usecase';
import { Schema } from 'mongoose';
import { AuthRequest } from '../utils/auth.middleware';

class ChatController {
  async getMessages(req: Request, res: Response): Promise<Response> {
    try {
      const messages = await GetMessagesUseCase.execute(req.params.id as unknown as Schema.Types.ObjectId);
      return res.json(messages);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async sendMessage(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { content } = req.body;
      const message = await SendMessageUseCase.execute(
        req.user!.id as unknown as Schema.Types.ObjectId,
        req.params.id as unknown as Schema.Types.ObjectId,
        content
      );
      req.io.to(req.params.id).emit('newMessage', message);
      return res.status(201).json(message);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteMessage(req: AuthRequest, res: Response): Promise<Response> {
    try {
      await DeleteMessageUseCase.execute(req.params.messageId, req.user!.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}

export default new ChatController();
