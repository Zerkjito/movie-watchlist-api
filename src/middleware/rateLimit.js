import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const isProduction = process.env.NODE_ENV === 'production';

let store;

if (isProduction) {
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.connect();

  store = new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  });
}

export const apiLimiter = rateLimit({
  windowMs: 1000 * 60,
  limit: isProduction ? 100 : 1000,
  keyGenerator: (req, res) => {
    if (req.user?.id) {
      return `user:${req.user.id}`;
    }
    return `ip:${ipKeyGenerator(req, res)}`;
  },
  message: {
    status: 'error',
    message: 'Too many requests, slow down!',
    code: 'TOO_MANY_REQUESTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
  store,
});
