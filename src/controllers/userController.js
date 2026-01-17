import { prisma } from '../config/db.js';
import { sendJSONError, sendJSONResponse } from '../utils/response.js';
import { serializeUser } from '../utils/serialize.js';
import { createHttpError } from '../utils/errors.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { clearCookies } from '../utils/cookies.js';

export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user) {
    throw createHttpError('User not found', 404, ERROR_CODES.USER_NOT_FOUND);
  }

  sendJSONResponse(res, { data: serializeUser(user) }, 200);
};

export const updateProfile = async (req, res) => {
  const { name, email } = req.validatedBody;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user) {
    throw createHttpError('User not found', 404, ERROR_CODES.USER_NOT_FOUND);
  }

  const updateData = Object.fromEntries(
    Object.entries({ name, email }).filter(([_, v]) => v !== 'undefined')
  );

  const updatedProfile = await prisma.user.update({
    where: { id: user.id },
    data: updateData,
  });

  return sendJSONResponse(res, { profile: updatedProfile }, 200);
};

export const logout = async (_req, res) => {
  clearCookies(res, 'accesss');
  clearCookies(res, 'refresh');

  sendJSONResponse(res, { message: 'Logged out succsessfully' }, 200);
};

export const updatePassword = async (req, res) => {
  const { currentPassword } = req.validatedBody;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user) {
    throw createHttpError('User not found', 404, ERROR_CODES.USER_NOT_FOUND);
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password);

  if (!isValidPassword) {
    throw createHttpError("Password does not match original password", , ERROR_CODES.INVALID_CREDENTIALS)
  }
};
