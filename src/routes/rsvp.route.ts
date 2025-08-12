import { Router } from 'express';
import RSVPController from '../controllers/rsvp.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { rateLimiterMiddleware } from '../middlewares/rate-limiter.middleware';
import { validateRsvp } from '../middlewares/validation.middleware';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: RSVPs
 *   description: RSVP management
 */

/**
 * @swagger
 * /events/{id}/rsvps:
 *   post:
 *     summary: Create or update an RSVP for an event
 *     tags: [RSVPs]
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
 *               status:
 *                 type: string
 *                 enum: [attending, cancelled]
 *     responses:
 *       201:
 *         description: RSVP created or updated successfully
 */
router.post('/', authMiddleware, rateLimiterMiddleware, validateRsvp, RSVPController.create);

/**
 * @swagger
 * /events/{id}/rsvps:
 *   get:
 *     summary: Get all RSVPs for an event
 *     tags: [RSVPs]
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
 *         description: A list of RSVPs
 */
router.get('/', authMiddleware, roleMiddleware(['admin', 'organizer']), RSVPController.getAll);

/**
 * @swagger
 * /events/{id}/rsvps/{rsvpId}/confirm:
 *   post:
 *     summary: Confirm an RSVP
 *     tags: [RSVPs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: rsvpId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: RSVP confirmed successfully
 */
router.post('/:rsvpId/confirm', authMiddleware, roleMiddleware(['admin', 'organizer']), RSVPController.confirm);

export default router;
