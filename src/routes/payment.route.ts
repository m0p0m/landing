import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateCheckout, validateRefund } from '../middlewares/validation.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /payments/checkout:
 *   post:
 *     summary: Create a checkout session
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 */
router.post('/checkout', authMiddleware, validateCheckout, PaymentController.checkout);

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Get payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of payments
 */
router.get('/history', authMiddleware, PaymentController.getHistory);

/**
 * @swagger
 * /payments/refund:
 *   post:
 *     summary: Create a refund
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund created successfully
 */
router.post('/refund', authMiddleware, roleMiddleware(['admin']), validateRefund, PaymentController.refund);

export default router;
