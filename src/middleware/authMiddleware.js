import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { createHttpError } from '../utils/errors.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export const authMiddleware = async (req, res, next) => {
  // Read token from the request
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    throw createHttpError('Not authorized, no token provided', 401, ERROR_CODES.NO_AUTH_TOKEN);
  }

  try {
    // Verifiy token and extract userId
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });

    if (!user) {
      throw createHttpError('User no longer exists', 401, ERROR_CODES.USER_NO_LONGER_EXISTS);
    }

    // Attach the user object to the request for future middlewares/controllers
    req.user = user;
    next();
  } catch (err) {
    throw createHttpError('Ivalid or expired token', 401, ERROR_CODES.INVALID_TOKEN);
  }
};
