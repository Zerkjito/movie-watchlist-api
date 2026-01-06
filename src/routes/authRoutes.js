import express from 'express';
import { register, login, refreshToken } from '../controllers/authController.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { userLoginSchema, userRegisterSchema } from '../validators/authValidators.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { csrfProtection } from '../middleware/csrf.js';

const router = express.Router();

// Public routes

router.post(
  '/register',
  apiLimiter,
  csrfProtection,
  validateRequest(userRegisterSchema),
  asyncHandler(register)
);

router.post(
  '/login',
  apiLimiter,
  csrfProtection,
  validateRequest(userLoginSchema),
  asyncHandler(login)
);

router.post('/refresh', apiLimiter, asyncHandler(refreshToken));

export default router;
