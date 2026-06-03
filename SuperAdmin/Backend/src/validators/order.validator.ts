import { z } from 'zod';
import { OrderStatus, PaymentStatus } from '@prisma/client';

const dateStringSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: 'Invalid date format, must be parseable date string (e.g. YYYY-MM-DD or ISO-8601)',
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID format'),
  }),
});

export const listOrdersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    restaurantId: z.string().uuid('Invalid restaurant ID format').optional(),
    startDate: dateStringSchema.optional(),
    endDate: dateStringSchema.optional(),
    orderStatus: z.nativeEnum(OrderStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  }),
});
