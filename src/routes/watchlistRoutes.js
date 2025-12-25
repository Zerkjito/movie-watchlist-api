import express from 'express';
import { addToWatchlistController } from '../controllers/watchlistController.js';

const router = express.Router();

router.post('/', addToWatchlistController);

export default router;
