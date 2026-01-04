import jwt from 'jsonwebtoken';
import { ENV } from '../constants/env.js';

export const generateToken = (userId, res) => {
  const payload = { id: userId };
  const signedJwt = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('jwt', signedJwt, {
    httpOnly: true,
    secure: ENV.IS_PRODUCTION,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};
