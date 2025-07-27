import RSVP, { IRSVP } from '../entities/RSVP';
import { Schema } from 'mongoose';

class RSVPRepository {
  async create(rsvp: Partial<IRSVP>): Promise<IRSVP> {
    return RSVP.create(rsvp);
  }

  async find(userId: Schema.Types.ObjectId, eventId: Schema.Types.ObjectId): Promise<IRSVP | null> {
    return RSVP.findOne({ user: userId, event: eventId });
  }

  async findByEvent(eventId: string): Promise<IRSVP[]> {
    return RSVP.find({ event: eventId }).populate('user', 'username');
  }
}

export default new RSVPRepository();
