import { prisma } from '../config/db.js';
import { sendJSONError, sendJSONResponse } from '../utils/response.js';
import { serializeUser } from '../utils/serialize.js';
import { throwMiddlewareError } from '../utils/errors.js';

export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user) {
    throw throwMiddlewareError('User not found', 404, 'USER_NOT_FOUND');
  }

  sendJSONResponse(res, { data: serializeUser(user) }, 200);
};

export const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  sendJSONResponse(res, { message: 'Logged out succsessfully' }, 200);
};
