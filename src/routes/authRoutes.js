import express from 'express';
import { register, login } from '../controllers/authController.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { userLoginSchema, userRegisterSchema } from '../validators/authValidators.js';
const router = express.Router();

// Public routes
router.post('/register', apiLimiter, validateRequest(userRegisterSchema), register);
router.post('/login', apiLimiter, validateRequest(userLoginSchema), login);

export default router;
