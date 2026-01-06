import express from 'express';
import { apiLimiter } from '../middleware/rateLimit.js';
import { issueCsrfToken } from '../controllers/csrfController.js';

const router = express.Router();

router.get('/csrf', apiLimiter, issueCsrfToken);

export default router;
