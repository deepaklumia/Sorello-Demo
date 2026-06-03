import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

import { setIo } from './utils/socket';

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

setIo(io);


io.on('connection', (socket) => {
  console.log('⚡ Client connected to WebSocket:', socket.id);

  socket.on('join-restaurant', (restaurantId: string) => {
    socket.join(restaurantId);
    console.log(`🔌 Socket ${socket.id} joined restaurant room: ${restaurantId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected from WebSocket:', socket.id);
  });
});

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('🔌 Connected to PostgreSQL via Prisma Client');

    const port = env.PORT;
    server.listen(port, () => {
      console.log(`🚀 Restaurant Admin Server listening on http://localhost:${port}`);
      console.log(`📄 Swagger documentation served at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to bootstrap Restaurant Admin Server:', error);
    process.exit(1);
  }
}

bootstrap();

