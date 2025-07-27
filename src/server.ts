import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { setupSocket } from './infrastructure/socket';
import AuthController from './controllers/AuthController';
import EventController from './controllers/EventController';
import RSVPController from './controllers/RSVPController';
import { authMiddleware } from './infrastructure/middleware/authMiddleware';

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/event-platform');

app.post('/register', AuthController.register);
app.post('/login', AuthController.login);

app.get('/events', EventController.getAll);
app.post('/events', authMiddleware, EventController.create);

app.post('/rsvp', authMiddleware, (req, res) => {
  const rsvp = RSVPController.create(req, res);
  io.to(req.body.eventId).emit('rsvp', rsvp);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
