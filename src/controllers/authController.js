import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendJSONResponse } from '../utils/response.js';
import { serializeUser } from '../utils/serialize.js';
import { createHttpError } from '../utils/errors.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';
import { setCookie } from '../utils/cookies.js';
import { createPasswordResetToken } from '../utils/tokens.js';

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

export const forgotPasswordHandler = async (req, res) => {
  const { email } = req.validatedBody;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return sendJSONResponse(res, { message: 'If an account exists, a reset link was sent' }, 200);
  }

  const { token, tokenHash, expires } = createPasswordResetToken();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: tokenHash,
      passwordResetExpires: expires,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&id=${user.id}`;

  // TBD (general idea)
  await sendMail({
    to: user.email,
    subject: 'Password reset',
    text: `Reset your password ${resetUrl}`,
    html: `<p>Reset your password${resetUrl}`,
  });

  return sendJSONResponse(res, { message: 'If an account exists, a reset link was sent' }, 200);
};

export const resetPasswordHandler = async (req, res) => {
  const { token, id, newPassword } = req.validatedBody;

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user || !user.passwordResetToken || user.passwordResetToken !== tokenHash) {
    throw createHttpError('Invalid or expired token', 400, ERROR_CODES.INVALID_TOKEN);
  }
  if (user.passwordResetExpires < new Date()) {
    throw createHttpError('Invalid or expired token', 400, ERROR_CODES.INVALID_TOKEN);
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  sendJSONResponse(res, { message: 'Password updated' }, 200);
};
