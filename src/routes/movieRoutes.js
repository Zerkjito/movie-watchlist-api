import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { addMovieSchema, updateMovieSchema } from '../validators/movieValidators.js';
import { addMovie, removeMovie, updateMovie } from '../controllers/movieController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.use(authMiddleware);
router.use(apiLimiter);

router.post('/', validateRequest(addMovieSchema), asyncHandler(addMovie));
router.patch('/:id', validateRequest(updateMovieSchema), asyncHandler(updateMovie));
router.delete('/:id', asyncHandler(removeMovie));

export default router;
