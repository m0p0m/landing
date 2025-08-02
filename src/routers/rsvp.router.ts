import { Router } from 'express';
import RSVPController from '../controllers/rsvp.controller';
import { authMiddleware } from '../utils/auth.middleware';

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, RSVPController.create);
router.get('/', RSVPController.getAll);

export default router;
