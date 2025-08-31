import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { setupSocket } from './sockets/socket.setup';
import connectDB from './config/database.config';
import { config } from './config';
import { errorHandler } from './utils/error.handler';
import mongoose from 'mongoose';
import * as Sentry from '@sentry/node';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';

import userRouter from './routes/user.route';
import eventRouter from './routes/event.route';
import rsvpRouter from './routes/rsvp.route';
import paymentRouter from './routes/payment.route';
import chatRouter from './routes/chat.route';
import stripeWebhookRouter from './routes/stripe-webhook.route';
import notificationRouter from './routes/notification.route';

const app = express();

Sentry.init({
  dsn: config.sentry.dsn,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

const server = http.createServer(app);
const io = setupSocket(server);

connectDB();

app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

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
app.use('/api/notifications', notificationRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/health', (req, res) => res.status(200).send('OK'));

app.get('/api/ready', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).send('OK');
  } else {
    res.status(503).send('Service Unavailable');
  }
});

app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);

export { server };
