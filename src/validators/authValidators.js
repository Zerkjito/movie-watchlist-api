import { z } from 'zod';

export const userRegisterSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(50, 'Name must be at most 50 characters'),

  email: z.string().trim().email(),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});
