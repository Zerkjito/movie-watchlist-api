import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { sendJSONResponse, sendJSONError } from '../utils/response.js';
import { generateToken } from '../utils/generateToken.js';
import { serializeUser } from '../utils/serialize.js';
import { createHttpError } from '../utils/errors.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Verify user
  const userExists = await prisma.user.findUnique({ where: { email: email } });

  if (userExists) {
    throw createHttpError('User already exists with this email', 400, 'EMAIL_ALREADY_EXISTS');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generate JWT token
  const token = generateToken(user.id, res);

  sendJSONResponse(res, { user: serializeUser(user), token }, 201);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Verify email
  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    return sendJSONError(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return sendJSONError(res, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Generate JWT token
  const token = generateToken(user.id, res);

  sendJSONResponse(res, { user: serializeUser(user, false), token }, 200);
};

export { register, login };
