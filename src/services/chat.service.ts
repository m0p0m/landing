import Message, { IMessage } from '../models/message.model';
import { Schema } from 'mongoose';

export class ChatService {
  static async sendMessage(
    userId: Schema.Types.ObjectId,
    eventId: Schema.Types.ObjectId,
    content: string
  ): Promise<IMessage> {
    const message = await Message.create({
      user: userId,
      event: eventId,
      content,
    });
    // In a real app, you'd probably want to populate the user info here before returning
    return message;
  }

  static async getMessages(eventId: Schema.Types.ObjectId): Promise<IMessage[]> {
    return Message.find({ event: eventId }).populate('user', 'username');
  }

  static async deleteMessage(messageId: string, userId: string, userRole: string): Promise<void> {
    const message = await Message.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    // Allow author or admin to delete the message
    if (message.user.toString() !== userId && userRole !== 'admin') {
      throw new Error('You are not authorized to delete this message');
    }

    await Message.findByIdAndDelete(messageId);
  }
}
