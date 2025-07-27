import { Router } from 'express';
import PaymentController from '../controllers/PaymentController';
import { authMiddleware } from '../utils/AuthMiddleware';

const router = Router();

router.post('/checkout', authMiddleware, PaymentController.checkout);
router.get('/history', authMiddleware, PaymentController.getHistory);

export default router;
