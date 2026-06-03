import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
    passwordPlain: z.string().min(6, 'Password must be at least 6 characters long').optional(),
    passwordHash: z.string().min(6, 'Password must be at least 6 characters long').optional(),
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    role: z.nativeEnum(UserRole).default(UserRole.SUPER_ADMIN),
  })
  .refine((data) => data.password || data.passwordPlain || data.passwordHash, {
    message: 'Password is required (as password, passwordPlain, or passwordHash)',
    path: ['password'],
  })
  .transform((data) => ({
    email: data.email,
    password: data.password || data.passwordPlain || data.passwordHash!,
    name: data.name,
    role: data.role,
  })),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
