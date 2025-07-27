import EventRepository from '../../repositories/event.repository';
import { IEvent } from '../../entities/event.entity';

class SearchEventsUseCase {
  async execute(query: string): Promise<IEvent[]> {
    return EventRepository.search(query);
  }
}

export default new SearchEventsUseCase();
