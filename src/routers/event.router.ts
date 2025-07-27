import { Router } from 'express';
import EventController from '../controllers/EventController';
import { authMiddleware } from '../utils/AuthMiddleware';
import { validateEvent } from '../utils/Validation';

const router = Router();

router.get('/', EventController.getAll);
router.get('/search', EventController.search);
router.get('/:id', EventController.getById);
router.post('/', authMiddleware, validateEvent, EventController.create);
router.put('/:id', authMiddleware, validateEvent, EventController.update);
router.delete('/:id', authMiddleware, EventController.delete);

export default router;
