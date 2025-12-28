import express from 'express';
import { addToWatchlist, removeFromWatchlist, updateWatchlistItem } from '../controllers/watchlistController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { addToWatchlistSchema, updateWatchlistSchema } from '../validators/watchlistValidators.js';
import { ipLimiter, userLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.use(authMiddleware);
router.use(ipLimiter, userLimiter);

router.post('/', validateRequest(addToWatchlistSchema), addToWatchlist);
router.patch('/:id', validateRequest(updateWatchlistSchema), updateWatchlistItem);
router.delete('/:id', removeFromWatchlist);

export default router;
