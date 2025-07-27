import EventRepository from '../../repositories/event.repository';
import { IEvent } from '../../entities/event.entity';
import { Schema } from 'mongoose';

class CreateEventUseCase {
  async execute(eventData: Partial<IEvent>, userId: Schema.Types.ObjectId): Promise<IEvent> {
    if (new Date(eventData.date as Date) < new Date()) {
      throw new Error('Event date must be in the future');
    }
    const event = await EventRepository.create({ ...eventData, createdBy: userId });
    return event;
  }
}

export default new CreateEventUseCase();
