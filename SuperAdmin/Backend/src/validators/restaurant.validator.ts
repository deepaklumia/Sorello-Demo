import { z } from 'zod';
import { RestaurantStatus } from '@prisma/client';

export const createRestaurantSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(5, 'Phone number is too short'),
    address: z.string().min(5, 'Address must be at least 5 characters long'),
    status: z.nativeEnum(RestaurantStatus).optional(),
    subscriptionPlan: z.string().min(1, 'Subscription plan is required'),
    slug: z.string().min(2, 'Slug must be at least 2 characters long')
      .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and dashes')
      .optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  }),
});

export const updateRestaurantSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid restaurant ID format'),
  }),
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().min(5, 'Phone number is too short').optional(),
    address: z.string().min(5, 'Address must be at least 5 characters long').optional(),
    subscriptionPlan: z.string().min(1, 'Subscription plan cannot be empty').optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

export const updateRestaurantStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid restaurant ID format'),
  }),
  body: z.object({
    status: z.nativeEnum(RestaurantStatus, {
      errorMap: () => ({ message: 'Status must be one of: ACTIVE, INACTIVE, SUSPENDED' }),
    }),
  }),
});

export const getRestaurantByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid restaurant ID format'),
  }),
});

export const listRestaurantsQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.nativeEnum(RestaurantStatus).optional(),
  }),
});
