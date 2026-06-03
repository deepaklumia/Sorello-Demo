import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
    phone: z.string().min(5, 'Phone number is too short').optional(),
    address: z.string().min(5, 'Address must be at least 5 characters long').optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});
