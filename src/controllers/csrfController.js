import crypto from 'crypto';
import { setCookie } from '../utils/cookies.js';

export const issueCsrfToken = (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString('hex');

  setCookie(res, 'csrf', csrfToken, {
    httpOnly: true,
    sameSite: 'strict',
  });

  res.status(204).end();
};
