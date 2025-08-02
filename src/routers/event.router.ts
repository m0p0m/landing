import { Router } from 'express';
import EventController from '../controllers/event.controller';
import { authMiddleware } from '../utils/auth.middleware';
import { eventOwnerMiddleware } from '../utils/event-owner.middleware';
import { validateEvent } from '../utils/validation.middleware';

const router = Router();

router.get('/', EventController.getAll);
router.get('/search', EventController.search);
router.get('/:id', EventController.getById);
router.post('/', authMiddleware, validateEvent, EventController.create);
router.put('/:id', authMiddleware, eventOwnerMiddleware, validateEvent, EventController.update);
router.delete('/:id', authMiddleware, eventOwnerMiddleware, EventController.delete);

export default router;
