import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - event
 *         - user
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the message
 *         event:
 *           type: string
 *           description: The id of the event
 *         user:
 *           type: string
 *           description: The id of the user who sent the message
 *         content:
 *           type: string
 *           description: The content of the message
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the message
 *       example:
 *         id: 60f1b1b1b1b1b1b1b1b1b1b1
 *         event: 60f1b1b1b1b1b1b1b1b1b1b2
 *         user: 60f1b1b1b1b1b1b1b1b1b1b3
 *         content: Hello, world!
 *         timestamp: 2025-01-01T12:00:00.000Z
 */

export interface IMessage extends Document {
  event: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  content: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default model<IMessage>('Message', MessageSchema);
