import MessageRepository from '../../repositories/message.repository';
import { IMessage } from '../../entities/message.entity';
import { Schema } from 'mongoose';

class SendMessageUseCase {
  async execute(
    userId: Schema.Types.ObjectId,
    eventId: Schema.Types.ObjectId,
    content: string
  ): Promise<IMessage> {
    const message = await MessageRepository.create({
      user: userId,
      event: eventId,
      content,
    });
    return message;
  }
}

export default new SendMessageUseCase();
