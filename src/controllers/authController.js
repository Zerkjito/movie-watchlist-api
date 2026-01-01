import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { sendJSONResponse } from '../utils/response.js';
import { generateToken } from '../utils/generateToken.js';
import { serializeUser } from '../utils/serialize.js';
import { createHttpError } from '../utils/errors.js';
import { ERROR_CODES } from '../constants/errorCodes.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Verify user
  const userExists = await prisma.user.findUnique({ where: { email: email } });

  if (userExists) {
    throw createHttpError('User already exists with this email', 409, ERROR_CODES.EMAIL_ALREADY_EXISTS);
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

  // Generate JWT token
  const token = generateToken(user.id, res);

  sendJSONResponse(res, { user: serializeUser(user), token }, 201);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

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

  // Generate JWT token
  const token = generateToken(user.id, res);

  sendJSONResponse(res, { user: serializeUser(user, false), token }, 200);
};
