import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { ipLimiter } from '../middleware/rateLimit.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { userLoginSchema, userRegisterSchema } from '../validators/authValidators.js';
const router = express.Router();

// Public routes
router.post('/register', ipLimiter, validateRequest(userRegisterSchema), register);
router.post('/login', ipLimiter, validateRequest(userLoginSchema), login);

// Auth routes
router.post('/logout', logout);

export default router;
