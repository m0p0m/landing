import Message, { IMessage } from '../entities/message.entity';
import { Schema } from 'mongoose';

class MessageRepository {
  async create(message: Partial<IMessage>): Promise<IMessage> {
    return Message.create(message);
  }

  async findByEvent(eventId: Schema.Types.ObjectId): Promise<IMessage[]> {
    return Message.find({ event: eventId }).populate('user', 'username');
  }
}

export default new MessageRepository();
