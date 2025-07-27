import EventRepository from '../repositories/EventRepository';
import { IEvent } from '../entities/Event';

class GetEvents {
  async execute(): Promise<IEvent[]> {
    return EventRepository.findAll();
  }
}

export default new GetEvents();
