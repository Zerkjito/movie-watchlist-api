import express from 'express';
import 'dotenv/config';
import { connectDB, disconnectDB } from './config/db.js';

// Import Routes
import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// API Routes
app.use('/movies', movieRoutes);
app.use('/auth', authRoutes);

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

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
