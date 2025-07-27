import EventRepository from '../../repositories/event.repository';
import { IEvent } from '../../entities/event.entity';

class GetEventsUseCase {
  async execute(filters: any, options: any): Promise<IEvent[]> {
    return EventRepository.findAll(filters, options);
  }
}

export default new GetEventsUseCase();
