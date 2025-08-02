import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authMiddleware } from '../utils/auth.middleware';
import { adminMiddleware } from '../utils/admin.middleware';
import {
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordResetConfirmation,
  validateProfileUpdate,
} from '../utils/validation.middleware';

const router = Router();

router.post('/register', validateRegistration, UserController.register);
router.post('/login', validateLogin, UserController.login);
router.post('/password-reset', validatePasswordResetRequest, UserController.requestPasswordReset);
router.post('/password-reset/confirm', validatePasswordResetConfirmation, UserController.confirmPasswordReset);
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, validateProfileUpdate, UserController.updateProfile);
router.get('/', authMiddleware, adminMiddleware, UserController.getAllUsers);
router.delete('/:id', authMiddleware, adminMiddleware, UserController.deleteUser);

export default router;
