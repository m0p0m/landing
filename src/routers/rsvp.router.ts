import { Router } from 'express';
import RSVPController from '../controllers/RSVPController';
import { authMiddleware } from '../utils/AuthMiddleware';

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, RSVPController.create);
router.get('/', RSVPController.getAll);

export default router;
