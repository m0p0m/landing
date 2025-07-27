import { Schema, model, Document } from 'mongoose';

export interface IRSVP extends Document {
  user: Schema.Types.ObjectId;
  event: Schema.Types.ObjectId;
  status: 'going' | 'not going';
}

const RSVPSchema = new Schema<IRSVP>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['going', 'not going'], required: true },
});

export default model<IRSVP>('RSVP', RSVPSchema);
