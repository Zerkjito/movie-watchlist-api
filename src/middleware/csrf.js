import { createHttpError } from '../utils/errors.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export const csrfProtection = (req, _res, next) => {
  const csrfCookie = req.cookies?.csrf;
  const csrfHeader = req.headers['x-csrf-token'];

  if (
    typeof csrfCookie !== 'string' ||
    typeof csrfHeader !== 'string' ||
    csrfCookie !== csrfHeader
  ) {
    throw createHttpError('Invalid CSRF token', 403, ERROR_CODES.INVALID_CSRF_TOKEN);
  }

  next();
};
