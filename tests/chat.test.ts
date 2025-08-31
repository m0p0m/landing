import { ChatService } from '../src/services/chat.service';
import { UserService } from '../src/services/user.service';
import { EventService } from '../src/services/event.service';
import { IEvent } from '../src/models/event.model';
import Message from '../src/models/message.model';
import { IUser } from '../src/models/user.model';
import { Schema } from 'mongoose';

describe('Chat Service', () => {
  let user: Partial<IUser>;
  let admin: Partial<IUser>;
  let event: IEvent | null = null;

  beforeEach(async () => {
    const userData = {
      username: 'chatuser',
      email: 'chat@test.com',
      password: 'password'
    };
    const { user: createdUser } = await UserService.register(userData);
    user = createdUser;

    const adminData = {
        username: 'chatadmin',
        email: 'chat_admin@test.com',
        password: 'password',
        role: 'admin'
    };
    const { user: createdAdmin } = await UserService.register(adminData as Partial<IUser>);
    admin = createdAdmin;

    const eventData: Partial<IEvent> = {
      title: 'Chat Test Event',
      description: 'This is a test event for chat',
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

  it('should send a message', async () => {
    if (!event) return;
    const message = await ChatService.sendMessage(user._id as Schema.Types.ObjectId, event._id as Schema.Types.ObjectId, 'Hello');
    expect(message).toHaveProperty('content', 'Hello');
  });

  it('should get messages for an event', async () => {
    if (!event) return;
    await ChatService.sendMessage(user._id as Schema.Types.ObjectId, event._id as Schema.Types.ObjectId, 'Hello');
    const messages = await ChatService.getMessages(event._id as Schema.Types.ObjectId);
    expect(messages.length).toBeGreaterThan(0);
  });

  it('should delete a message by author', async () => {
    if (!event) return;
    const message = await ChatService.sendMessage(user._id as Schema.Types.ObjectId, event._id as Schema.Types.ObjectId, 'Hello');
    await ChatService.deleteMessage(message._id.toString(), user._id as string, user.role as string);
    const deletedMessage = await Message.findById(message._id);
    expect(deletedMessage).toBeNull();
  });

  it('should delete a message by admin', async () => {
    if (!event) return;
    const message = await ChatService.sendMessage(user._id as Schema.Types.ObjectId, event._id as Schema.Types.ObjectId, 'Hello');
    await ChatService.deleteMessage(message._id.toString(), admin._id as string, admin.role as string);
    const deletedMessage = await Message.findById(message._id);
    expect(deletedMessage).toBeNull();
  });
});
