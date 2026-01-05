import express from 'express';
import 'dotenv/config';
import { connectDB, disconnectDB } from './config/db.js';

// Import Routes
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createHttpError } from './utils/errors.js';
import { ERROR_CODES } from './constants/errorCodes.js';
import { ENV } from './constants/env.js';
import cookieParser from 'cookie-parser';

const app = express();

// IMPORTANT: enable if behind Cloudflare / Nginx
if (ENV.IS_PRODUCTION) {
  app.set('trust proxy', 1);
}

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/watchlist', watchlistRoutes);

// 404 - Route not found
app.use((req, res, next) => {
  const message = ENV.IS_PRODUCTION ? 'Route not found' : `Route ${req.originalUrl} not found`;
  const error = createHttpError(message, 404, ERROR_CODES.ROUTE_NOT_FOUND);
  next(error);
});

app.use(errorHandler);

const PORT = 5001;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Rejection', err);
      server.close(async () => {
        await disconnectDB();
        process.exit(1);
      });
    });

    process.on('uncaughtException', async (err) => {
      console.error('Uncaught exception', err);
      await disconnectDB();
      process.exit(1);
    });

    process.on('SIGTERM', async () => {
      console.log('SIGTERM recieved, shutting down gracefully');
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
