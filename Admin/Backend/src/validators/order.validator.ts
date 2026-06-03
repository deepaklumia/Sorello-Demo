import { z } from 'zod';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export const listOrdersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    startDate: z.string().datetime({ message: 'Invalid start date format (ISO-8601 expected)' }).optional(),
    endDate: z.string().datetime({ message: 'Invalid end date format (ISO-8601 expected)' }).optional(),
    orderStatus: z.nativeEnum(OrderStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  }),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
});

export const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().min(1, 'Customer name is required'),
    cartId: z.string().uuid('Invalid cart ID'),
  }),
});

export const updateOrderSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
  body: z.object({
    orderStatus: z.nativeEnum(OrderStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  }),
});

export default listOrdersQuerySchema;

