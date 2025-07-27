import express from 'express';
import http from 'http';
import { setupSocket } from '../sockets/SocketIOSetup';
import connectDB from '../database/MongoDBConnection';
import { errorHandler } from '../../utils/ErrorHandler';
import { validateRegistration, validateEvent } from '../../utils/Validation';
import { authMiddleware } from '../../utils/AuthMiddleware';

import UserController from '../../controllers/UserController';
import EventController from '../../controllers/EventController';
import RSVPController from '../../controllers/RSVPController';
import PaymentController from '../../controllers/PaymentController';

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

connectDB();

app.use(express.json());

// User Routes
app.post('/api/users/register', validateRegistration, UserController.register);
app.post('/api/users/login', UserController.login);
app.get('/api/users/profile', authMiddleware, UserController.getProfile);
app.put('/api/users/profile', authMiddleware, UserController.updateProfile);

// Event Routes
app.get('/api/events', EventController.getAll);
app.get('/api/events/:id', EventController.getById);
app.post('/api/events', authMiddleware, validateEvent, EventController.create);
app.put('/api/events/:id', authMiddleware, validateEvent, EventController.update);
app.delete('/api/events/:id', authMiddleware, EventController.delete);

// RSVP Routes
app.post('/api/events/:id/rsvp', authMiddleware, (req, res) => {
  const rsvp = RSVPController.create(req, res);
  io.to(req.params.id).emit('rsvp', rsvp);
});
app.get('/api/events/:id/rsvps', RSVPController.getAll);


// Payment Routes
app.post('/api/payments/checkout', authMiddleware, PaymentController.checkout);
app.get('/api/payments/history', authMiddleware, PaymentController.getHistory);


app.use(errorHandler);

export { server };
