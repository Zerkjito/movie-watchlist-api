import express from 'express';
import { logout } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

router.use(authMiddleware);

router.post('logout', apiLimiter, asyncHandler(logout));

router.get('profile', apiLimiter);

export default router;
