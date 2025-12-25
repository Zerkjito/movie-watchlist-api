import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { sendJSONResponse, sendJSONError } from '../utils/response.js';
import { serializeUser } from '../utils/serialize.js';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExits = await prisma.user.findUnique({ where: { email: email } });

  if (userExits) {
    return sendJSONError(res, 'User already exists with this email', 400);
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

  sendJSONResponse(res, { user: serializeUser(user) }, 201);
};

export { register };
