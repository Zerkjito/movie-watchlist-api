import express from 'express';
import { logout } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { csrfProtection } from '../middleware/csrf.js';

const router = express.Router();

router.use(authMiddleware);

router.post('logout', csrfProtection, apiLimiter, asyncHandler(logout));

router.get('profile', apiLimiter);

export default router;
