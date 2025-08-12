import { Schema, model, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - user
 *         - event
 *         - amount
 *         - stripePaymentId
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the payment
 *         user:
 *           type: string
 *           description: The id of the user who made the payment
 *         event:
 *           type: string
 *           description: The id of the event
 *         amount:
 *           type: number
 *           description: The amount of the payment
 *         stripePaymentId:
 *           type: string
 *           description: The Stripe payment intent ID
 *         status:
 *           type: string
 *           description: The status of the payment
 *       example:
 *         id: 60f1b1b1b1b1b1b1b1b1b1b1
 *         user: 60f1b1b1b1b1b1b1b1b1b1b2
 *         event: 60f1b1b1b1b1b1b1b1b1b1b3
 *         amount: 10
 *         stripePaymentId: pi_123
 *         status: completed
 */

export interface IPayment extends Document {
  user: Schema.Types.ObjectId;
  event: Schema.Types.ObjectId;
  amount: number;
  stripePaymentId: string;
  status: string;
}

const PaymentSchema = new Schema<IPayment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  amount: { type: Number, required: true },
  stripePaymentId: { type: String, required: true },
  status: { type: String, required: true },
});

export default model<IPayment>('Payment', PaymentSchema);
