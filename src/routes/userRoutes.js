import express from 'express';
import { logout } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { apiLimiter } from '../middleware/rateLimit';

const router = express.Router();

router.use(authMiddleware);

router.post('logout', apiLimiter, logout);

router.get('profile', apiLimiter);

export default router;
