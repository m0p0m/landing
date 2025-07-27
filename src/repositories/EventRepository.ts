import Event, { IEvent } from '../entities/Event';

class EventRepository {
  async create(event: Partial<IEvent>): Promise<IEvent> {
    return Event.create(event);
  }

  async findAll(filters: any, options: any): Promise<IEvent[]> {
    return Event.find(filters)
      .populate('createdBy', 'username email')
      .skip(options.skip)
      .limit(options.limit);
  }

  async findById(id: string): Promise<IEvent | null> {
    return Event.findById(id).populate('createdBy', 'username email');
  }

  async update(id: string, event: Partial<IEvent>): Promise<IEvent | null> {
    return Event.findByIdAndUpdate(id, event, { new: true });
  }

  async delete(id: string): Promise<void> {
    await Event.findByIdAndDelete(id);
  }
}

export default new EventRepository();
