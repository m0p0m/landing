import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';
import { authMiddleware } from '../utils/auth.middleware';
import { validateCheckout } from '../utils/validation.middleware';

const router = Router();

router.post('/checkout', authMiddleware, validateCheckout, PaymentController.checkout);
router.get('/history', authMiddleware, PaymentController.getHistory);

export default router;
