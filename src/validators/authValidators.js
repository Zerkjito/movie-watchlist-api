import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const emailSchema = z.string().trim().email();

const userBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must have at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),

  email: emailSchema,

  password: passwordSchema,
});

export const userRegisterSchema = userBaseSchema;

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = userBaseSchema
  .omit({ password: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { error: 'At least one field must be provided' });

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password is required'),
  newPassword: passwordSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    id: z.uuid().optional(),
    newPassword: passwordSchema,
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.confirmPassword) return true;
      return data.newPassword === data.confirmPassword;
    },
    { error: 'Passwords do not match', path: ['confirmPassword'] }
  );
