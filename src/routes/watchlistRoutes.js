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
import { csrfProtection } from '../middleware/csrf.js';

const router = express.Router();

router.use(authMiddleware);
router.use(apiLimiter);

router.post(
  '/',
  csrfProtection,
  validateRequest(addToWatchlistSchema),
  asyncHandler(addToWatchlist)
);

router.patch(
  '/:id',
  csrfProtection,
  validateRequest(updateWatchlistSchema),
  asyncHandler(updateWatchlistItem)
);

router.delete('/:id', csrfProtection, asyncHandler(removeFromWatchlist));

export default router;
