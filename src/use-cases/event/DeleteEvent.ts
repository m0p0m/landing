import EventRepository from '../../repositories/EventRepository';

class DeleteEvent {
  async execute(eventId: string): Promise<void> {
    return EventRepository.delete(eventId);
  }
}

export default new DeleteEvent();
