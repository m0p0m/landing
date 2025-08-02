import Message, { IMessage } from '../entities/message.entity';
import { Schema } from 'mongoose';

class MessageRepository {
  async create(message: Partial<IMessage>): Promise<IMessage> {
    return Message.create(message);
  }

  async findByEvent(eventId: Schema.Types.ObjectId): Promise<IMessage[]> {
    return Message.find({ event: eventId }).populate('user', 'username');
  }

  async findById(id: string): Promise<IMessage | null> {
    return Message.findById(id);
  }

  async delete(id: string): Promise<void> {
    await Message.findByIdAndDelete(id);
  }
}

export default new MessageRepository();
