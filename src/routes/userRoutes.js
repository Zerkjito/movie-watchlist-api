import express from 'express';
import {
  getProfile,
  logout,
  updatePassword,
  updateProfile,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { apiLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { csrfProtection } from '../middleware/csrf.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { updatePasswordSchema, updateProfileSchema } from '../validators/authValidators.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/me', csrfProtection, apiLimiter, asyncHandler(getProfile));

router.patch(
  '/me',
  csrfProtection,
  apiLimiter,
  validateRequest(updateProfileSchema),
  asyncHandler(updateProfile)
);

router.patch(
  '/me/password',
  csrfProtection,
  apiLimiter,
  validateRequest(updatePasswordSchema),
  asyncHandler(updatePassword)
);
router.post('/logout', csrfProtection, apiLimiter, asyncHandler(logout));

export default router;
