import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { ipLimiter } from '../middleware/rateLimit.js';
const router = express.Router();

router.post('/register', ipLimiter, register);
router.post('/login', ipLimiter, login);
router.post('/logout', logout);

export default router;
