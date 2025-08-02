import { Router } from 'express';
import { authMiddleware } from '../utils/auth.middleware';
import ChatController from '../controllers/chat.controller';
import { validateChatMessage } from '../utils/validation.middleware';

const router = Router({ mergeParams: true });

router.get('/', authMiddleware, ChatController.getMessages);
router.post('/', authMiddleware, validateChatMessage, ChatController.sendMessage);
router.delete('/:messageId', authMiddleware, ChatController.deleteMessage);

export default router;
