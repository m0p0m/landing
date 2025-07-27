import EventRepository from '../../repositories/EventRepository';
import { IEvent } from '../../entities/Event';

class UpdateEvent {
  async execute(eventId: string, eventData: Partial<IEvent>): Promise<IEvent | null> {
    return EventRepository.update(eventId, eventData);
  }
}

export default new UpdateEvent();
