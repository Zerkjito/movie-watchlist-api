import { PrismaClient } from '@prisma/client';
import { ENV } from '../constants/env';

const prisma = new PrismaClient({
  log: ENV.IS_DEVELOPMENT ? ['query', 'error', 'warn'] : ['error'],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('DB Connected via Prisma');
  } catch (error) {
    console.error(`Database connection error ${error}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
