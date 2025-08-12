import Notification from '../models/notification.model';
import { Schema } from 'mongoose';

export class NotificationService {
  static async createNotification(
    userId: Schema.Types.ObjectId,
    message: string,
    type: 'rsvp' | 'event' | 'payment',
    related: { eventId?: Schema.Types.ObjectId; paymentId?: Schema.Types.ObjectId }
  ) {
    await Notification.create({
      user: userId,
      message,
      type,
      related,
    });
    // Here you would also emit a socket event to the user to notify them in real-time
  }

  static async getNotifications(userId: string) {
    return Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  static async markAsRead(notificationId: string, userId: string) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );
  }
}
