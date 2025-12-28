import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { ipLimiter, userLimiter } from '../middleware/rateLimit';
import { validateRequest } from '../middleware/validateRequest';
import { addMovieSchema, updateMovieSchema } from '../validators/movieValidators';
import { addMovie, removeMovie, updateMovie } from '../controllers/movieController';

const router = express.Router();

router.use(authMiddleware);
router.use(ipLimiter, userLimiter);

router.post('/', validateRequest(addMovieSchema), addMovie);
router.patch('/:id', validateRequest(updateMovieSchema), updateMovie);
router.delete('/:id', removeMovie);

export default router;
