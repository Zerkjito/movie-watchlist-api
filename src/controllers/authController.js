import { prisma } from '../config/db.js';
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExits = await prisma.user.findUnique({ where: { email: email } });

  if (userExits) {
    return res.status(400).json({ error: 'User already exists with this email' });
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

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  });
};

export { register };
