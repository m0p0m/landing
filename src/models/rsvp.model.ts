import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     RSVP:
 *       type: object
 *       required:
 *         - user
 *         - event
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the RSVP
 *         user:
 *           type: string
 *           description: The id of the user who RSVP'd
 *         event:
 *           type: string
 *           description: The id of the event
 *         status:
 *           type: string
 *           enum: [attending, waitlisted, cancelled, attended]
 *           description: The status of the RSVP
 *       example:
 *         id: 60f1b1b1b1b1b1b1b1b1b1b1
 *         user: 60f1b1b1b1b1b1b1b1b1b1b2
 *         event: 60f1b1b1b1b1b1b1b1b1b1b3
 *         status: attending
 */

export interface IRSVP extends Document {
  user: Schema.Types.ObjectId;
  event: Schema.Types.ObjectId;
  status: 'attending' | 'waitlisted' | 'cancelled' | 'attended';
}

const RSVPSchema = new Schema<IRSVP>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['attending', 'waitlisted', 'cancelled', 'attended'], required: true },
});

export default model<IRSVP>('RSVP', RSVPSchema);
