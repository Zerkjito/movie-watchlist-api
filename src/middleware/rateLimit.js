import rateLimit from 'express-rate-limit';

export const ipLimiter = rateLimit({
  windowMs: 1000 * 60 * 1,
  limit: 100,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, slow down!',
    code: 'TOO_MANY_REQUESTS_IP',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const userLimiter = rateLimit({
  windowMs: 1000 * 60 * 1,
  limit: 50,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: {
    status: 'error',
    message: 'Too many requests, slow down!',
    code: 'TOO_MANY_REQUESTS_USER',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
