import { Schema, model, Document } from 'mongoose';

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
