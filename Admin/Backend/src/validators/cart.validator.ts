import { z } from 'zod';

export const addCartItemSchema = z.object({
  body: z.object({
    cartId: z.string().uuid('Invalid cart ID').optional(),
    menuItemId: z.string().uuid('Invalid menu item ID'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    customizations: z.string().optional(),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid cart ID'),
    itemId: z.string().uuid('Invalid cart item ID'),
  }),
  body: z.object({
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    customizations: z.string().optional(),
  }),
});

export const cartIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid cart ID'),
    itemId: z.string().uuid('Invalid cart item ID').optional(),
  }),
});
