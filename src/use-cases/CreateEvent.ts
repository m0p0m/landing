import EventRepository from '../repositories/EventRepository';
import { IEvent } from '../entities/Event';
import { Schema } from 'mongoose';

class CreateEvent {
  async execute(eventData: Partial<IEvent>, userId: Schema.Types.ObjectId): Promise<IEvent> {
    const event = await EventRepository.create({ ...eventData, createdBy: userId });
    return event;
  }
}

export default new CreateEvent();
