import { Schema, model, Document } from 'mongoose';

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
