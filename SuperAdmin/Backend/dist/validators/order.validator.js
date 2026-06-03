"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrdersQuerySchema = exports.getOrderByIdSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const dateStringSchema = zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format, must be parseable date string (e.g. YYYY-MM-DD or ISO-8601)',
});
exports.getOrderByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid order ID format'),
    }),
});
exports.listOrdersQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        restaurantId: zod_1.z.string().uuid('Invalid restaurant ID format').optional(),
        startDate: dateStringSchema.optional(),
        endDate: dateStringSchema.optional(),
        orderStatus: zod_1.z.nativeEnum(client_1.OrderStatus).optional(),
        paymentStatus: zod_1.z.nativeEnum(client_1.PaymentStatus).optional(),
    }),
});
