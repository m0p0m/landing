import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import SendMessageUseCase from '../../use-cases/chat/send-message.usecase';
import { Schema } from 'mongoose';

export const setupSocket = (server: http.Server) => {
  const io = new SocketIOServer(server);

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinEvent', (eventId) => {
      socket.join(eventId);
    });

    socket.on('chatMessage', (data) => {
      // This is now handled by the ChatController
    });

    socket.on('rsvp', (data) => {
      io.to(data.eventId).emit('rsvp', data);
    });

    socket.on('eventUpdate', (data) => {
      io.to(data.eventId).emit('eventUpdate', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return io;
};
