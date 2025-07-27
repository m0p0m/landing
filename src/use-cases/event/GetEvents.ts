import EventRepository from '../../repositories/EventRepository';
import { IEvent } from '../../entities/Event';

class GetEvents {
  async execute(filters: any, options: any): Promise<IEvent[]> {
    return EventRepository.findAll(filters, options);
  }
}

export default new GetEvents();
