import { PaymentService } from '../src/services/payment.service';
import { UserService } from '../src/services/user.service';
import { EventService } from '../src/services/event.service';
import { IEvent } from '../src/models/event.model';
import Stripe from 'stripe';
import { IUser } from '../src/models/user.model';
import { Schema } from 'mongoose';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({ url: 'http://test.com' }),
        },
      },
      refunds: {
        create: jest.fn().mockResolvedValue({ id: 're_123' }),
      },
    };
  });
});

describe('Payment Service', () => {
  let user: Partial<IUser>;
  let event: IEvent | null = null;

  beforeEach(async () => {
    const userData = {
      username: 'paymentuser',
      email: 'payment@test.com',
      password: 'password'
    };
    const { user: createdUser } = await UserService.register(userData);
    user = createdUser;

    const eventData: Partial<IEvent> = {
      title: 'Payment Test Event',
      description: 'This is a test event for payment',
      date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      time: '10:00',
      location: {
        type: 'Point',
        coordinates: [0, 0],
        address: 'Test address'
      },
      category: 'Test',
      capacity: 100,
      isPremium: true,
      price: 10,
    };
    const createdEvent = await EventService.createEvent(eventData, user._id as Schema.Types.ObjectId);
    event = Array.isArray(createdEvent) ? createdEvent[0] : createdEvent;
  });

  it('should create a checkout session', async () => {
    if (!event) return;
    const session = await PaymentService.createCheckoutSession(user._id as Schema.Types.ObjectId, event._id as string);
    expect(session).toHaveProperty('url');
  });

  it('should create a refund', async () => {
    const refund = await PaymentService.createRefund('pi_123');
    expect(refund).toHaveProperty('id');
  });
});
