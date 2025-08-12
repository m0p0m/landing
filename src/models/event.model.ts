import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - time
 *         - location
 *         - category
 *         - capacity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the event
 *         title:
 *           type: string
 *           description: The title of the event
 *         description:
 *           type: string
 *           description: The description of the event
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the event
 *         time:
 *           type: string
 *           description: The time of the event
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *             address:
 *               type: string
 *         category:
 *           type: string
 *           description: The category of the event
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: The tags for the event
 *         isPremium:
 *           type: boolean
 *           description: Whether the event is premium
 *         price:
 *           type: number
 *           description: The price of the event
 *         capacity:
 *           type: number
 *           description: The capacity of the event
 *         status:
 *           type: string
 *           enum: [scheduled, cancelled, completed]
 *           description: The status of the event
 *         recurring:
 *           type: object
 *           properties:
 *             frequency:
 *               type: string
 *               enum: [daily, weekly, monthly]
 *             endDate:
 *               type: string
 *               format: date
 *       example:
 *         id: 60f1b1b1b1b1b1b1b1b1b1b1
 *         title: Test Event
 *         description: This is a test event
 *         date: 2025-01-01
 *         time: '10:00'
 *         location: { type: 'Point', coordinates: [0, 0], address: 'Test address' }
 *         category: Test
 *         tags: [test, event]
 *         isPremium: false
 *         price: 0
 *         capacity: 100
 *         status: scheduled
 */

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: {
    type: 'Point';
    coordinates: number[];
    address: string;
  };
  category: string;
  tags: string[];
  isPremium: boolean;
  price: number;
  capacity: number;
  status: 'scheduled' | 'cancelled' | 'completed';
  recurring: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate: Date;
  };
  createdBy: Schema.Types.ObjectId;
  rsvpCount?: number;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true, text: true },
  description: { type: String, required: true, text: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
    address: { type: String, required: true },
  },
  category: { type: String, required: true },
  tags: [{ type: String }],
  isPremium: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ['scheduled', 'cancelled', 'completed'], default: 'scheduled' },
  recurring: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
    endDate: { type: Date },
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

EventSchema.index({ location: '2dsphere' });

EventSchema.virtual('rsvpCount', {
  ref: 'RSVP',
  localField: '_id',
  foreignField: 'event',
  count: true
});

export default model<IEvent>('Event', EventSchema);
