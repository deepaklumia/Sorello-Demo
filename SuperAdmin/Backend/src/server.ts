import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
  console.log(`📖 API docs available at http://localhost:${env.PORT}/api-docs`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Initiating graceful shutdown...`);
  
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await prisma.$disconnect();
      console.log('Prisma database client disconnected.');
      process.exit(0);
    } catch (err) {
      console.error('Error disconnecting Prisma client:', err);
      process.exit(1);
    }
  });

  // Timeout shutdown safety fallback
  setTimeout(() => {
    console.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
