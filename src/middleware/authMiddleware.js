import { prisma } from '../config/db.js';
import { createHttpError } from '../utils/errors.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = async (req, _res, next) => {
  try {
    const accessToken = req.cookies?.access;

    if (!accessToken) {
      throw createHttpError(
        'Not authorized, no access token provided',
        401,
        ERROR_CODES.NO_AUTH_TOKEN
      );
    }

    const payload = verifyToken(accessToken, process.env.JWT_ACCESS_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      throw createHttpError('User no longer exists', 401, ERROR_CODES.USER_NO_LONGER_EXISTS);
    }

    req.user = user;
    next();
  } catch (_err) {
    throw createHttpError('Ivalid or expired token', 401, ERROR_CODES.INVALID_TOKEN);
  }
};
