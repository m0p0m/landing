import MessageRepository from '../../repositories/message.repository';
import { IMessage } from '../../entities/message.entity';
import { Schema } from 'mongoose';

class GetMessagesUseCase {
  async execute(eventId: Schema.Types.ObjectId): Promise<IMessage[]> {
    return MessageRepository.findByEvent(eventId);
  }
}

export default new GetMessagesUseCase();
