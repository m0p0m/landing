import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - user
 *         - message
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the notification
 *         user:
 *           type: string
 *           description: The id of the user who received the notification
 *         message:
 *           type: string
 *           description: The content of the notification
 *         read:
 *           type: boolean
 *           description: Whether the notification has been read
 *         type:
 *           type: string
 *           enum: [rsvp, event, payment]
 *           description: The type of the notification
 *         related:
 *           type: object
 *           properties:
 *             eventId:
 *               type: string
 *             paymentId:
 *               type: string
 *       example:
 *         id: 60f1b1b1b1b1b1b1b1b1b1b1
 *         user: 60f1b1b1b1b1b1b1b1b1b1b2
 *         message: Your RSVP has been confirmed
 *         read: false
 *         type: rsvp
 */

export interface INotification extends Document {
  user: Schema.Types.ObjectId;
  message: string;
  read: boolean;
  type: 'rsvp' | 'event' | 'payment';
  related: {
    eventId?: Schema.Types.ObjectId;
    paymentId?: Schema.Types.ObjectId;
  };
}

const NotificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['rsvp', 'event', 'payment'], required: true },
  related: {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
  },
}, {
  timestamps: true,
});

export default model<INotification>('Notification', NotificationSchema);
