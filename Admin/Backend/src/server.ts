import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('🔌 Connected to PostgreSQL via Prisma Client');

    const port = env.PORT;
    app.listen(port, () => {
      console.log(`🚀 Restaurant Admin Server listening on http://localhost:${port}`);
      console.log(`📄 Swagger documentation served at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to bootstrap Restaurant Admin Server:', error);
    process.exit(1);
  }
}

bootstrap();
