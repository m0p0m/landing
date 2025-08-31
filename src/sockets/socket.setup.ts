import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { ChatService } from '../services/chat.service';
import { Schema } from 'mongoose';

export const setupSocket = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*', // In production, you should restrict this to your client's URL
    },
  });

  const chatNamespace = io.of(/^\/chat\/\w+$/);
  chatNamespace.on('connection', (socket) => {
    const eventId = socket.nsp.name.split('/').pop();
    console.log(`A user connected to chat for event ${eventId}`);

    socket.on('typing', () => {
      socket.broadcast.emit('typing');
    });

    socket.on('stop_typing', () => {
      socket.broadcast.emit('stop_typing');
    });

    socket.on('read_receipt', (messageId) => {
      // Here you would update the message in the database
      socket.broadcast.emit('read_receipt', messageId);
    });

    socket.on('disconnect', () => {
      console.log(`A user disconnected from chat for event ${eventId}`);
    });
  });

  // You can still have a default namespace for other real-time features
  io.on('connection', (socket) => {
    console.log('A user connected to the default namespace');
  });

  return io;
};
