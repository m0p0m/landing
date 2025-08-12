import { EventService } from '../src/services/event.service';
import { UserService } from '../src/services/user.service';
import { IEvent } from '../src/models/event.model';
import Event from '../src/models/event.model';
import { IUser } from '../src/models/user.model';
import { Schema } from 'mongoose';

describe('Event Service', () => {
  let user: Partial<IUser>;
  let event: IEvent | null = null;

  beforeEach(async () => {
    const userData = {
      username: 'eventuser',
      email: 'event@test.com',
      password: 'password'
    };
    const { user: createdUser } = await UserService.register(userData);
    user = createdUser;

    const eventData: Partial<IEvent> = {
      title: 'Test Event',
      description: 'This is a test event',
      date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      time: '10:00',
      location: {
        type: 'Point',
        coordinates: [0, 0],
        address: 'Test address'
      },
      category: 'Test',
      capacity: 100,
    };
    const createdEvent = await EventService.createEvent(eventData, user._id as Schema.Types.ObjectId);
    event = Array.isArray(createdEvent) ? createdEvent[0] : createdEvent;
  });

  it('should get a list of events', async () => {
    const events = await EventService.getEvents({});
    expect(events.length).toBeGreaterThan(0);
  });

  it('should get an event by id', async () => {
    if (!event) return;
    const foundEvent = await EventService.getEventById(event._id as string);
    expect(foundEvent).toBeDefined();
    expect(foundEvent!.title).toEqual(event.title);
  });

  it('should update an event', async () => {
    if (!event) return;
    const updatedEvent = await EventService.updateEvent(event._id as string, { title: 'New Title' });
    expect(updatedEvent).toBeDefined();
    expect(updatedEvent!.title).toEqual('New Title');
  });

  it('should delete an event', async () => {
    if (!event) return;
    await EventService.deleteEvent(event._id as string);
    const deletedEvent = await Event.findById(event._id);
    expect(deletedEvent).toBeNull();
  });
});
