import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { sendJSONResponse } from '../utils/response.js';
import { serializeUser } from '../utils/serialize.js';
import { createHttpError } from '../utils/errors.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
import { setCookie } from '../utils/cookies.js';

export const register = async (req, res) => {
  const { name, email, password } = req.validatedBody;

  // Verify user
  const userExists = await prisma.user.findUnique({ where: { email: email } });

  if (userExists) {
    throw createHttpError(
      'User already exists with this email',
      409,
      ERROR_CODES.EMAIL_ALREADY_EXISTS
    );
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
    },
  });

  const accessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);

  setCookie(res, 'access', accessToken, { maxAge: 1000 * 60 * 15 });
  setCookie(res, 'refresh', newRefreshToken, { maxAge: 1000 * 60 * 60 * 24 * 7 });

  sendJSONResponse(res, { user: serializeUser(user) }, 201);
};

export const login = async (req, res) => {
  const { email, password } = req.validatedBody;

  // Verify email
  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    throw createHttpError('Invalid email or password', 401, ERROR_CODES.INVALID_CREDENTIALS);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createHttpError('Invalid email or password', 401, ERROR_CODES.INVALID_CREDENTIALS);
  }

  const accessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);

  setCookie(res, 'access', accessToken, { maxAge: 1000 * 60 * 15 });
  setCookie(res, 'refresh', newRefreshToken, { maxAge: 1000 * 60 * 60 * 24 * 7 });

  sendJSONResponse(res, { user: serializeUser(user, false) }, 200);
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refresh;

  if (!refreshToken) {
    throw createHttpError('Invalid or expired token', 401, ERROR_CODES.INVALID_TOKEN);
  }

  const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

  const user = await prisma.user.findUnique({ where: { id: payload.id } });

  if (!user) {
    throw createHttpError('User no longer exists', 401, ERROR_CODES.USER_NO_LONGER_EXISTS);
  }

  const accessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);

  setCookie(res, 'access', accessToken, { maxAge: 1000 * 60 * 15 });
  setCookie(res, 'refresh', newRefreshToken, { maxAge: 1000 * 60 * 60 * 24 * 7 });

  sendJSONResponse(res, { user: serializeUser(user) }, 200);
};
