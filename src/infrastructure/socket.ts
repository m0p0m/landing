import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { Application } from 'express';

export const setupSocket = (server: http.Server) => {
  const io = new SocketIOServer(server);

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinEvent', (eventId) => {
      socket.join(eventId);
    });

    socket.on('chatMessage', (data) => {
      io.to(data.eventId).emit('chatMessage', data);
    });

    socket.on('rsvp', (data) => {
      io.to(data.eventId).emit('rsvp', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return io;
};
