import express from 'express';
import { addToWatchlist, removeFromWatchlist, updateWatchlistItem } from '../controllers/watchlistController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { addToWatchlistSchema } from '../validators/watchlistValidators.js';
import { ipLimiter, userLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', ipLimiter, userLimiter, validateRequest(addToWatchlistSchema), addToWatchlist);
router.delete('/:id', ipLimiter, userLimiter, removeFromWatchlist);
router.patch('/:id', ipLimiter, userLimiter, updateWatchlistItem);

export default router;
