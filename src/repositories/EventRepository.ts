import Event, { IEvent } from '../entities/Event';

class EventRepository {
  async create(event: Partial<IEvent>): Promise<IEvent> {
    return Event.create(event);
  }

  async findAll(): Promise<IEvent[]> {
    return Event.find().populate('createdBy', 'username email');
  }
}

export default new EventRepository();
