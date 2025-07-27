import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authMiddleware } from '../utils/AuthMiddleware';
import { validateRegistration } from '../utils/Validation';

const router = Router();

router.post('/register', validateRegistration, UserController.register);
router.post('/login', UserController.login);
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);

export default router;
