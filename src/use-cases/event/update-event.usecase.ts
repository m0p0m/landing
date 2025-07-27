import EventRepository from '../../repositories/event.repository';
import { IEvent } from '../../entities/event.entity';

class UpdateEventUseCase {
  async execute(eventId: string, eventData: Partial<IEvent>): Promise<IEvent | null> {
    return EventRepository.update(eventId, eventData);
  }
}

export default new UpdateEventUseCase();
