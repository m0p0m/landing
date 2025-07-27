import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  tags: string[];
  isPremium: boolean;
  createdBy: Schema.Types.ObjectId;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  isPremium: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model<IEvent>('Event', EventSchema);
