import express from 'express';

import {
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistItem,
} from '../controllers/watchlistController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { addToWatchlistSchema, updateWatchlistSchema } from '../validators/watchlistValidators.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.use(authMiddleware);
router.use(apiLimiter);

router.post('/', validateRequest(addToWatchlistSchema), asyncHandler(addToWatchlist));
router.patch('/:id', validateRequest(updateWatchlistSchema), asyncHandler(updateWatchlistItem));
router.delete('/:id', asyncHandler(removeFromWatchlist));

export default router;
