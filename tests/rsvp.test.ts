import { RsvpService } from '../src/services/rsvp.service';
import { UserService } from '../src/services/user.service';
import { EventService } from '../src/services/event.service';
import { IEvent } from '../src/models/event.model';
import RSVP from '../src/models/rsvp.model';
import { IUser } from '../src/models/user.model';
import { Schema } from 'mongoose';

describe('RSVP Service', () => {
  let user: Partial<IUser>;
  let event: IEvent | null = null;

  beforeEach(async () => {
    const userData = {
      username: 'rsvpuser',
      email: 'rsvp@test.com',
      password: 'password'
    };
    const { user: createdUser } = await UserService.register(userData);
    user = createdUser;

    const eventData: Partial<IEvent> = {
      title: 'RSVP Test Event',
      description: 'This is a test event for RSVP',
      date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      time: '10:00',
      location: {
        type: 'Point',
        coordinates: [0, 0],
        address: 'Test address'
      },
      category: 'Test',
      capacity: 1,
    };
    const createdEvent = await EventService.createEvent(eventData, user._id as Schema.Types.ObjectId);
    event = Array.isArray(createdEvent) ? createdEvent[0] : createdEvent;
  });

  it('should create an RSVP', async () => {
    if (!event) return;
    const rsvp = await RsvpService.createOrUpdateRsvp(user._id as Schema.Types.ObjectId, event._id as Schema.Types.ObjectId, 'attending');
    expect(rsvp).toHaveProperty('status', 'attending');
  });

  it('should get RSVPs for an event', async () => {
    if (!event) return;
    await RsvpService.createOrUpdateRsvp(user._id as Schema.Types.ObjectId, event._id as Schema.Types.ObjectId, 'attending');
    const rsvps = await RsvpService.getRsvpsForEvent(event._id as string);
    expect(rsvps.length).toBeGreaterThan(0);
  });

  it('should put a user on the waitlist if the event is full', async () => {
    if (!event) return;
    const anotherUserData = {
      username: 'anotheruser',
      email: 'another@test.com',
      password: 'password'
    };
    const { user: anotherUser } = await UserService.register(anotherUserData);
    await RsvpService.createOrUpdateRsvp(user._id as Schema.Types.ObjectId, event._id as Schema.Types.ObjectId, 'attending');
    const rsvp = await RsvpService.createOrUpdateRsvp(anotherUser._id as Schema.Types.ObjectId, event._id as Schema.Types.ObjectId, 'attending');
    expect(rsvp.status).toEqual('waitlisted');
  });
});
