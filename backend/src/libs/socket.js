import { Server as SocketIO } from 'socket.io';
import { logger } from './logger';

let io;

const initIO = async httpServer => {
  io = new SocketIO(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL
    }
  });

  io.on('connection', socket => {
    logger.info('Client Connected');
    socket.on('joinChatBox', waChatUuid => {
      logger.info('A client joined a chat channel');
      socket.join(waChatUuid);
    });

    socket.on('joinNotification', () => {
      logger.info('A client joined notification channel');
      socket.join('notification');
    });

    socket.on('joinWaChat', status => {
      logger.info(`A client joined to ${status} chat list channel.`);
      socket.join(status);
    });

    socket.on('disconnect', () => {
      logger.info('Client disconnected');
    });
  });
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('ERROR_SOCKETIO_NOT_INITIALIZED');
  }
  return io;
};

const socketSignal = {
  initIO,
  getIO
};

module.exports = socketSignal;
