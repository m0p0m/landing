import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import ChatController from '../controllers/chat.controller';
import { validateChatMessage } from '../middlewares/validation.middleware';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Real-time chat management
 */

/**
 * @swagger
 * /events/{id}/messages:
 *   get:
 *     summary: Get all messages for an event
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of messages
 */
router.get('/', authMiddleware, ChatController.getMessages);

/**
 * @swagger
 * /events/{id}/messages:
 *   post:
 *     summary: Send a message to an event chat
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post('/', authMiddleware, validateChatMessage, ChatController.sendMessage);

/**
 * @swagger
 * /events/{id}/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Message deleted successfully
 */
router.delete('/:messageId', authMiddleware, ChatController.deleteMessage);

export default router;
