import { Router } from 'express';
import { authMiddleware } from '../utils/AuthMiddleware';
import GetMessagesUseCase from '../use-cases/chat/get-messages.usecase';
import { Schema } from 'mongoose';

const router = Router({ mergeParams: true });

router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await GetMessagesUseCase.execute(req.params.id as unknown as Schema.Types.ObjectId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
