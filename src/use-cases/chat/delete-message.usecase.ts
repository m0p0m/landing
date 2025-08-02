import MessageRepository from '../../repositories/message.repository';
import { IMessage } from '../../entities/message.entity';

class DeleteMessageUseCase {
  async execute(messageId: string, userId: string): Promise<void> {
    const message = await MessageRepository.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.user.toString() !== userId) {
      // We might want to allow admins to delete messages as well
      // For now, only the author can delete
      throw new Error('You are not authorized to delete this message');
    }

    await MessageRepository.delete(messageId);
  }
}

export default new DeleteMessageUseCase();
