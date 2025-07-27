import RSVPRepository from '../../repositories/RSVPRepository';
import { IRSVP } from '../../entities/RSVP';

class GetRSVPs {
  async execute(eventId: string): Promise<IRSVP[]> {
    return RSVPRepository.findByEvent(eventId);
  }
}

export default new GetRSVPs();
