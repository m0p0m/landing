import EventRepository from '../../repositories/EventRepository';
import { IEvent } from '../../entities/Event';
import { Schema } from 'mongoose';

class CreateEvent {
  async execute(eventData: Partial<IEvent>, userId: Schema.Types.ObjectId): Promise<IEvent> {
    if (new Date(eventData.date as Date) < new Date()) {
      throw new Error('Event date must be in the future');
    }
    const event = await EventRepository.create({ ...eventData, createdBy: userId });
    return event;
  }
}

export default new CreateEvent();
