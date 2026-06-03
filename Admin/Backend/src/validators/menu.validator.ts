import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    description: z.string().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Category name cannot be empty').optional(),
    description: z.string().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
});

export const createItemSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Invalid category ID'),
    name: z.string().min(1, 'Item name is required'),
    description: z.string().optional(),
    imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
    price: z.number().positive('Price must be greater than zero'),
    preparationTime: z.number().int().nonnegative('Preparation time must be a non-negative integer'),
    isAvailable: z.boolean().optional(),
  }),
});

export const updateItemSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid item ID'),
  }),
  body: z.object({
    categoryId: z.string().uuid('Invalid category ID').optional(),
    name: z.string().min(1, 'Item name cannot be empty').optional(),
    description: z.string().optional(),
    imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
    price: z.number().positive('Price must be greater than zero').optional(),
    preparationTime: z.number().int().nonnegative('Preparation time must be a non-negative integer').optional(),
    isAvailable: z.boolean().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

export const getItemByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid item ID'),
  }),
});

export const updateItemAvailabilitySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid item ID'),
  }),
  body: z.object({
    isAvailable: z.boolean({
      required_error: 'Availability status is required',
    }),
  }),
});
export default createCategorySchema;
