"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderByIdSchema = exports.listOrdersQuerySchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.listOrdersQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        startDate: zod_1.z.string().datetime({ message: 'Invalid start date format (ISO-8601 expected)' }).optional(),
        endDate: zod_1.z.string().datetime({ message: 'Invalid end date format (ISO-8601 expected)' }).optional(),
        orderStatus: zod_1.z.nativeEnum(client_1.OrderStatus).optional(),
        paymentStatus: zod_1.z.nativeEnum(client_1.PaymentStatus).optional(),
    }),
});
exports.getOrderByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid order ID'),
    }),
});
exports.default = exports.listOrdersQuerySchema;
