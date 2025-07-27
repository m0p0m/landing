import EventRepository from '../../repositories/event.repository';

class DeleteEventUseCase {
  async execute(eventId: string): Promise<void> {
    return EventRepository.delete(eventId);
  }
}

export default new DeleteEventUseCase();
