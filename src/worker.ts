import { createWorker, eventReminderQueue } from './config/bullmq.config';
import { sendPasswordResetEmail } from './services/email.service';
import Event from './models/event.model';
import RSVP from './models/rsvp.model';
import { NotificationService } from './services/notification.service';

console.log('Worker started');

createWorker('email', async (job) => {
  const { to, token } = job.data;
  console.log(`Sending password reset email to ${to}`);
  // In a real app, you would generate the reset URL here
  await sendPasswordResetEmail(to, `Your reset token is: ${token}`);
});

createWorker('event-reminder', async (job) => {
  const { eventId, userId, userEmail, eventTitle } = job.data;
  console.log(`Sending reminder for event "${eventTitle}" to ${userEmail}`);
  // In a real app, you would send an email here
  await NotificationService.createNotification(
    userId,
    `Reminder: Your event "${eventTitle}" is starting soon.`,
    'event',
    { eventId }
  );
});

// Schedule a job to run every hour to check for upcoming events
eventReminderQueue.add(
  'check-upcoming-events',
  {},
  {
    repeat: {
      every: 1000 * 60 * 60, // Every hour
    },
  }
);

createWorker('check-upcoming-events', async () => {
  console.log('Checking for upcoming events...');
  const upcomingEvents = await Event.find({
    date: {
      $gte: new Date(),
      $lte: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // In the next 24 hours
    },
  });

  for (const event of upcomingEvents) {
    const rsvps = await RSVP.find({ event: event._id, status: 'attending' }).populate('user');
    for (const rsvp of rsvps) {
      await eventReminderQueue.add('event-reminder', {
        eventId: event._id,
        userId: rsvp.user._id,
        userEmail: (rsvp.user as any).email,
        eventTitle: event.title,
      });
    }
  }
});
