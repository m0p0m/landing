import express from 'express';
import http from 'http';
import rateLimit from 'express-rate-limit';
import { setupSocket } from '../sockets/socket-io.setup';
import connectDB from '../database/mongodb-connection';
import { errorHandler } from '../../utils/error.handler';

import userRouter from '../../routers/user.router';
import eventRouter from '../../routers/event.router';
import rsvpRouter from '../../routers/rsvp.router';
import paymentRouter from '../../routers/payment.router';
import chatRouter from '../../routers/chat.router';
import stripeWebhookRouter from '../../routers/stripe.webhook.router';

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

connectDB();

app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use('/api/users', userRouter);
app.use('/api/events', eventRouter);
app.use('/api/events/:id/rsvps', rsvpRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/events/:id/messages', chatRouter);
app.use('/api/stripe/webhook', stripeWebhookRouter);

app.get('/api/health', (req, res) => res.status(200).send('OK'));

app.use(errorHandler);

export { server };
