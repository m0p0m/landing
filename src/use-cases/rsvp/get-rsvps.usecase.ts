import RSVPRepository from '../../repositories/rsvp.repository';
import { IRSVP } from '../../entities/rsvp.entity';

class GetRSVPsUseCase {
  async execute(eventId: string): Promise<IRSVP[]> {
    return RSVPRepository.findByEvent(eventId);
  }
}

export default new GetRSVPsUseCase();
