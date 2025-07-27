import RSVPRepository from '../../repositories/RSVPRepository';
import { IRSVP } from '../../entities/RSVP';
import { Schema } from 'mongoose';

class RSVPToEvent {
  async execute(
    userId: Schema.Types.ObjectId,
    eventId: Schema.Types.ObjectId,
    status: 'going' | 'not going'
  ): Promise<IRSVP> {
    const existingRSVP = await RSVPRepository.find(userId, eventId);

    if (existingRSVP) {
      existingRSVP.status = status;
      return existingRSVP.save();
    }

    const rsvp = await RSVPRepository.create({ user: userId, event: eventId, status });
    return rsvp;
  }
}

export default new RSVPToEvent();
