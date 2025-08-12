import Event, { IEvent } from '../models/event.model';
import { Schema } from 'mongoose';
import APIFeatures from '../utils/api-features';

export class EventService {
  static async createEvent(eventData: Partial<IEvent>, userId: Schema.Types.ObjectId): Promise<IEvent | IEvent[]> {
    if (new Date(eventData.date as Date) < new Date()) {
      throw new Error('Event date must be in the future');
    }

    if (eventData.recurring) {
      const events: Partial<IEvent>[] = [];
      const { frequency, endDate } = eventData.recurring;
      let currentDate = new Date(eventData.date as Date);

      while (currentDate <= new Date(endDate)) {
        events.push({
          ...eventData,
          date: new Date(currentDate),
          createdBy: userId,
        });

        if (frequency === 'daily') {
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (frequency === 'weekly') {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (frequency === 'monthly') {
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      }

      const createdEvents = await Event.insertMany(events);
      return createdEvents as IEvent[];
    }

    const event = await Event.create({ ...eventData, createdBy: userId });
    return event;
  }

  static async getEvents(queryString: any): Promise<IEvent[]> {
    const features = new APIFeatures(Event.find().populate('createdBy', 'username email') as any, queryString)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const events = await features.query;
    return events;
  }

  static async getEventById(eventId: string): Promise<IEvent | null> {
    return Event.findById(eventId).populate('createdBy', 'username email');
  }

  static async updateEvent(eventId: string, eventData: Partial<IEvent>): Promise<IEvent | null> {
    return Event.findByIdAndUpdate(eventId, eventData, { new: true });
  }

  static async deleteEvent(eventId: string): Promise<void> {
    await Event.findByIdAndDelete(eventId);
  }

  static async searchEvents(query: string): Promise<IEvent[]> {
    const events = await Event.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
    return events;
  }

  static async findEventsWithin(distance: number, latlng: string, unit: string): Promise<IEvent[]> {
    const [lat, lng] = latlng.split(',').map(parseFloat);
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
      throw new Error('Please provide latitude and longitude in the format lat,lng.');
    }

    const events = await Event.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    return events;
  }
}
