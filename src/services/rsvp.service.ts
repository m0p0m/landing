import RSVP, { IRSVP } from '../models/rsvp.model';
import Event from '../models/event.model';
import { Schema } from 'mongoose';
import { NotificationService } from './notification.service';

export class RsvpService {
  static async createOrUpdateRsvp(
    userId: Schema.Types.ObjectId,
    eventId: Schema.Types.ObjectId,
    status: 'attending' | 'waitlisted' | 'cancelled'
  ): Promise<IRSVP> {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const existingRsvp = await RSVP.findOne({ user: userId, event: eventId });

    if (existingRsvp) {
      existingRsvp.status = status;
      await existingRsvp.save();

      await NotificationService.createNotification(
        userId,
        `Your RSVP for "${event.title}" has been updated to "${status}".`,
        'rsvp',
        { eventId: event._id as Schema.Types.ObjectId }
      );

      return existingRsvp;
    }

    // Check event capacity before creating a new RSVP
    let finalStatus = status;
    const rsvpCount = await RSVP.countDocuments({ event: eventId, status: 'attending' });
    if (event.capacity && rsvpCount >= event.capacity) {
        if (status === 'attending') { // Only waitlist if they are trying to attend
            finalStatus = 'waitlisted';
        }
    }

    const newRsvp = await RSVP.create({
      user: userId,
      event: eventId,
      status: finalStatus,
    });

    await NotificationService.createNotification(
      userId,
      `You have successfully RSVP'd for "${event.title}". Your status is "${finalStatus}".`,
      'rsvp',
      { eventId: event._id as Schema.Types.ObjectId }
    );

    return newRsvp;
  }

  static async getRsvpsForEvent(eventId: string): Promise<IRSVP[]> {
    return RSVP.find({ event: eventId }).populate('user', 'username email');
  }

  static async getRsvpForUser(userId: string, eventId: string): Promise<IRSVP | null> {
    return RSVP.findOne({ user: userId, event: eventId });
  }

  static async confirmAttendance(rsvpId: string): Promise<IRSVP | null> {
    return RSVP.findByIdAndUpdate(rsvpId, { status: 'attended' }, { new: true });
  }

  // This would be called when an RSVP is cancelled to promote someone from the waitlist
  static async promoteFromWaitlist(eventId: string): Promise<void> {
      const event = await Event.findById(eventId);
      if (!event) return;

      const rsvpCount = await RSVP.countDocuments({ event: eventId, status: 'attending' });
      if (event.capacity && rsvpCount < event.capacity) {
          const waitlistedRsvp = await RSVP.findOneAndUpdate(
              { event: eventId, status: 'waitlisted' },
              { status: 'attending' },
              { new: true, sort: { createdAt: 1 } } // Promote the oldest waitlisted user
          );

          if (waitlistedRsvp) {
            await NotificationService.createNotification(
              waitlistedRsvp.user,
              `You have been moved from the waitlist to attending for "${event.title}".`,
              'rsvp',
              { eventId: event._id as Schema.Types.ObjectId }
            );
          }
      }
  }
}
